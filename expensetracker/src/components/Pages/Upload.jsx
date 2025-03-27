import React, { useState, useEffect, useRef } from 'react';
import "./Upload.css";
import { storage, auth, deleteFileByImage } from "../../firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";

// Exports the function to display images for the receipt gallery
export function Upload() {

    // Consts to set the image list to display and check if the useEffect has been run already.
    const [imageList, setImageList] = useState([]);
    const effectRan = useRef(false);

    // Reference to the user's saved images in Firebase Storage
    const imageListRef = ref(storage, `${auth.currentUser.email}`);

    // This will retrieve images from Firebase Storage and add them to the imageList to be displayed
    useEffect(() => {
        if(!effectRan.current){ // Check if the effect has been run already
            listAll(imageListRef).then((response) => { // Get the list of all images from Firebase Storage
                console.log(response);
                response.items.forEach((item) => { // For each image, get the URL and add it to the imageList
                    getDownloadURL(item).then((url) => {
                        setImageList((prev) => [...prev, url]);
                    })
                })
            })
        }
        return () => effectRan.current = true; // Prevents double rendering images with the above if statement
     }, []);

    // This constant function will be used to delete images
    const deleteFile = (url) => {
        Swal.fire({ // SweetAlert popup to confirm image deletion
            title: "Delete Confirmation",
            text: "Are you sure you want to Delete this expense?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "No, keep it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteFileByImage(url); // This function is defined in firebase.jsx
                document.getElementById(url).style.display = "none"; // Remove image from being displayed
            }
        })
     }

    return(
        <div className="fileUploader">
            {imageList.map((url) => { // maps each url in the imageList
                // Each image will have it's id set to the url and have a delete button for deleting it.
                return (
                    <div id={url}>
                    <img src={url}/>
                    <button className='deleteImg' onClick={() => deleteFile(url)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                );
            })}

        </div>
    );
}