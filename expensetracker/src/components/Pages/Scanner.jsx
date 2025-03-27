import "./Scanner.css"
import React, {useRef, useState, useEffect} from 'react';
import Webcam from "react-webcam";
import * as ReactDOM from 'react-dom';
import axios from "axios";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, auth, saveExpenseFromImage } from "../../firebase";
import { RotatingLines } from "react-loader-spinner";
import Swal from 'sweetalert2'


// Exports the main scanner functions to capture the image
export function Scanner() {

    // Consts to capture an image, call the webcam, and get the image source
    const [capturedImage, setCapturedImage] = useState(null)
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);

    // This constant function acts as the bridge from the python backend to the frontend using the 8080 port
    const fetchAPI = async () =>{
        const response = await axios.get("http://localhost:8080/api/receipt")
        console.log(response.data.users);
    };

    useEffect(() => {
        fetchAPI()
    }, [])


// This constant function will capture a screenshot and set the image to display on the site
    const capture = React.useCallback(async() => {

        const imageSrc = webcamRef.current.getScreenshot(); // Gets the screenshot from the webcam
        const imageRef = ref(storage, `${auth.currentUser.email}/${Date()}`) // Image will get stored to Firebase under the users account
        const blob = await fetch(imageSrc).then((res) => res.blob()); // Converts the screenshots to a 'blob' which then gets processed as a jpeg
        processImage(imageRef, blob); // Image gets processed here
        
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    //For image file uploading
    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);
    const effectRan = useRef(false);
    const allowedExtensions = ['webp', 'png', 'jpg', 'jpeg', 'heic', 'tiff', 'tif'] // These are the only file types allowed by Mindee API

    //For image file uploading
    const uploadImage = () =>{
        if(imageUpload == null) return;
        const fileExtension = imageUpload.name.split('.').pop().toLowerCase();
        console.log(imageUpload);
        const fileSize = imageUpload.size / (1024 * 1024); // Max image size
        console.log(allowedExtensions.includes(fileExtension));
        console.log(fileSize);

        // Alert pops up when a bad file is uploaded or scanned
        if(!allowedExtensions.includes(fileExtension) & fileSize < 10) {
            console.log("BAD FILE");
            Swal.fire({
                icon:'error',
                title: 'Invalid File',
                text: 'Invalid file extension or file was too big.',
                confirmButtonText: 'Okay'
            })
            return;
        }

        // Image gets processed and stored to Firebase
        const imageRef = ref(storage, `${auth.currentUser.email}/${Date()}`)
        processImage(imageRef, imageUpload);
        setImgSrc(imageUpload);

    };

    // When a receipt is scanned or uploaded, this processing pop up will appear to let the user know the image is being processed
    const processImage = (imageRef, image) => {
        Swal.fire({
            title: 'Processing Image...',
            willOpen() {
              Swal.showLoading()
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false
        })
        uploadBytes(imageRef, image).then((snapshot) => {
            console.log(`blob uploaded, ${Date()}`);
            getDownloadURL(snapshot.ref).then((url) => {

                //Flask connection to get image url and process the receipts
                fetch(`http://localhost:8080/api/receipt?url=${encodeURIComponent(url)}`)
                .then(response => response.json())
                .then((data) => {

                    Swal.close(); // This alert will let users know if the image is invalid
                    console.log(data);
                    if(data.total == null || data.date == null){
                        console.log("This is not a good image");
                        Swal.fire({
                            icon:'error',
                            title: 'Invalid Image',
                            text: `The receipt that you capture was invalid or was not read properly.\nPlease try again.`,
                            confirmButtonText: 'Okay'
                        })
                        deleteObject(imageRef).then(() => {
                            console.log("Image removed, no data stored.") // If the image is invalid, the data will not be stored
                        }).catch((error) => {
                            console.log(error);
                        })
                    }
                    else{
                        
                        // This gets the data from the items name and price 
                        data.items.forEach(item => {
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                <td colSpan="2">${item.name}</td>
                                <td>${item.price}</td>
                            `;
                            document.getElementById('expense-info').appendChild(newRow);
                        })

                        // Get the stores name, but returns no store found if the api does not find anything
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
                            <td>${data.date}</td>
                            <td>${data.store ? data.store: "No Store Found"}</td>
                            <td>${data.total}</td>
                        `;
                        document.getElementById('gen-info').appendChild(newRow);
                        saveExpenseFromImage(data.category, data.total, data.date, url, data.store);

                        // This alert will pop up when a receipt is successfully uploaded along with the data from thereceipt
                        Swal.fire({ 
                            icon:'success',
                            title: 'Expense Added',
                            text: `You successfully entered expense category ${data.category} for amount $${data.total} on ${data.date}`,
                            confirmButtonText: 'Okay'
                        })
                    }
                })
                .catch(error => console.error('Error:', error));
            })
        })
    }

     // This useEffect stores the receipt data directly to the users account along with the image url
     useEffect(() => {
        const imageListRef = ref(storage, `${auth.currentUser.email}`);

        if(!effectRan.current){
            listAll(imageListRef).then((response) => {
                console.log(response);
                response.items.forEach((item) => {
                    getDownloadURL(item).then((url) => {
                        setImageList((prev) => [...prev, url]);
                    })
                })
            })
        }
        return () => effectRan.current = true;
     }, []);

    return(

        
        // from Upload.jsx
        <>

            {/* div for spacing on top on the scanner */}
            <div className="fileUploader">

            </div>

            {/* If user does not have a webcam on their device, they can click this hyperlink to auto scroll the down to the image uploader */}
            <div className='link'>
                <p>Don't Have a Webcam? </p>
                <a href="http://localhost:5173/scanner#bttn"> Click Here! </a>
            </div>

            {/* Main code to display the webcam to the user and capture their receipts */}
            <div className="scan" id="root">
                
                <div className="container">
                    {/* Enables webcam for user */}
                    {!capturedImage && (
                        <Webcam className="cam" audio={false} ref={webcamRef} screenshotFormat="image/jpeg" setCapturedImage={setCapturedImage} />
                    )}
                    {capturedImage && <img src={capturedImage} />}

                    {/*This button will capture the image and store it in the database*/}
                    <button className="capture-bttn" onClick={capture}>
                        Capture
                    </button>

                {/* First table holds data for date of receipt, store name, and total amount of receipt */}
                <table className="general-table" cellSpacing={0}>
                    <thead>
                        <tr className="general-row">
                            <th>Date</th>
                            <th>Store Name</th>
                            <th>Total</th>
                        </tr>
                        </thead>
                     <tbody id="gen-info"></tbody>
                </table>
                {/* Second table holds data for the specific items on each receipt and the items prices*/}
                <table className="scan-table" cellSpacing={0}>
                    <thead>
                        <tr className="scan-row">
                        <th colSpan="2">Item Name</th>
                        <th>Item Price</th>
                        </tr>
                    </thead>
                        <tbody id="expense-info"></tbody>
                </table>
                
                    {/* This line will allow the source image to save on the web page */}
                    {imgSrc && (
                        <img
                            src={imgSrc} />

                    )}

               
                {/* Input for uploading files instead of scanning receipts */}
                <input className='file' type="file" onChange={(event) => { setImageUpload(event.target.files[0]); } } />
                <button id='bttn' className="input-bttn" onClick={uploadImage}>Upload Image</button>

                </div>
                
            </div>
            
        </>

    )

    
}

// This line will render the image of the screenshot
ReactDOM.render(<Scanner />, document.getElementById("root"));