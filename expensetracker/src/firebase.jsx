import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getStorage, ref, deleteObject} from "firebase/storage";
import { getFirestore, collection, setDoc, doc, addDoc, getDocs, query, where, deleteDoc, updateDoc, orderBy } from "firebase/firestore";
import Swal from "sweetalert2";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJerXPYOWOs3qqGwoxPPhwIppNjEnqIIw",
    authDomain: "expensetracker-26815.firebaseapp.com",
    projectId: "expensetracker-26815",
    storageBucket: "expensetracker-26815.appspot.com",
    messagingSenderId: "798411099828",
    appId: "1:798411099828:web:2e2bde89f684f954afd1e1"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig); 
//Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
// Initialize Firebase Storage (for images)
export const storage = getStorage(app);
//Initialize Firestore Database (for general database)
const db = getFirestore(app);

// Function to save basic user data to firestore. Only used for creating new users.
export async function saveUser(userId, email){
    email = email.toLowerCase();
    const usersRef = collection(db, "Users");
    await setDoc(doc(usersRef, email), {
        email: email,
        userId: userId,
    });
    console.log('Data Saved correctly (probably)');
}

// Function to save manual entry expense into Firestore Database
export async function saveExpense(itemCategory, itemPrice, itemDate) {
    // get current user's email
    const userEmail = auth?.currentUser?.email || '';
    // Reference to user's Expenses collection in firebase to store expenses
    const expensesRef = collection(db, `Users/${userEmail}/Expenses`);

    // check if user email is not empty which means user is already logged in
    // we must make sure user is logged in before adding expense
    if (userEmail !== '') {
        // addDoc adds new expense every time
        const exp = await addDoc(expensesRef, {
            category: itemCategory,
            price: itemPrice,
            date: itemDate
        });
        Swal.fire({
            icon:'success',
            title: 'Expense Added',
            text: `You successfully entered expense category ${itemCategory} for amount $${itemPrice} on ${itemDate}`,
            confirmButtonText: 'Okay'
        })
        //return the expense id of the newly created expense
        return exp;
    } else {
        Swal.fire({
            icon:'error',
            title: 'Login Error',
            text: 'You have to login first to save an expense',
            confirmButtonText: 'Okay'
        })
    }
}

// Function to save data extracted from images to Firestore Database.
export async function saveExpenseFromImage(itemCategory, itemPrice, itemDate, imageurl, storeName) {
    // get current user's email
    const userEmail = auth?.currentUser?.email || '';
    // Reference to user's Expenses collection in firebase to store expenses
    const expensesRef = collection(db, `Users/${userEmail}/Expenses`);

    // check if user email is not empty which means user is already logged in
    // we must make sure user is logged in before adding expense
    if (userEmail !== '') {
        // addDoc adds new expense every time
        await addDoc(expensesRef, {
            category: itemCategory,
            price: itemPrice,
            date: itemDate,
            url: imageurl,
            store: storeName
        });
    } else {
        Swal.fire({
            icon:'error',
            title: 'Login Error',
            text: 'You have to login first to save an expense',
            confirmButtonText: 'Okay'
        })
    }
}

// Function to get all of the users expenses from Firestore Database
export async function getExpenses() {
    // get current user's email
    const userEmail = auth?.currentUser?.email || '';
    const results = [];

    if (userEmail) {
        const expensesRef = collection(db, `Users/${userEmail}/Expenses`);
        // query databse, to get those expenses only where email matches current logged in user's email
        // also get the expenses in order by "date"
        const q = query(expensesRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // add 'id' of the expense so we can update and delete that expense
            results.push({ ...doc.data(), id: doc.id })
        })
    }
    return results;
}


// this function separates expenses into months for the chart
export function getGroupedExpenses(expenses) {
    // make object to store months expenses separately
    const grouped = {};

    // for each expense, separate it in it's own month
    expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

        // if first expense of the month, make it ready with an array to store expenses
        if (!grouped[monthKey]) {
            grouped[monthKey] = [];
        }
        // add the expense to the month's group
        grouped[monthKey].push(expense);
    })
    // return all groups having expenses separated into months
    return grouped;
}

// Function to delete the given expense from Firestore Database
export async function removeExpense(expense) {
    try {
        // get current user's email who is signed in
        const userEmail = auth?.currentUser?.email || '';

        if (userEmail !== '') {
            // find expense we need to remove using "id"
            const expenseDoc = doc(db, `Users/${userEmail}/Expenses`, expense.id);

            //If the expense has an image tied to it, delete
            if(expense.url){
                deleteObject(ref(storage, expense.url)).then(() => {
                    console.log("Image successfully deleted!");
                }).catch((error) => {
                    console.log("Error removing image: ", error);
                })
            }

            // delete expense from the database
            await deleteDoc(expenseDoc);

            Swal.fire({
                icon:'success',
                title: 'Expense Deleted',
                text: 'You have successfully deleted the expense!',
                confirmButtonText: 'Okay'
            })
        } else {
            Swal.fire({
                icon:'error',
                title: 'Login Error',
                text: 'You have to login first to save an expense',
                confirmButtonText: 'Okay'
            })
        }
    } catch (e) {
        console.log("Error removing expense")
    }
}

// Function update the given expense in Firestore Database after being edited
export async function updateExpense(expense) {
    try {
        // get current user's email who is signed in
        const userEmail = auth?.currentUser?.email || '';

        if (userEmail !== '') {
            // find expense in the database that we want to update using "expense.id"
            const expenseDoc = doc(db, `Users/${userEmail}/Expenses`, expense.id);
            // update expense in the database with the updated "expense" object
            await updateDoc(expenseDoc, expense);
            Swal.fire({
                icon:'success',
                title: 'Expense Updated',
                text: 'You have successfully updated the expense!',
                confirmButtonText: 'Okay'
            })
            //alert("You have successfully updated the expense!")
        } else {
            Swal.fire({
                icon:'error',
                title: 'Login Error',
                text: 'You have to login first to save an expense',
                confirmButtonText: 'Okay'
            })
            //alert("You need to login first to update the expense");
        }
        
    } catch (e) {
        console.log("Error updating expense");
    }
}

// Function to delete an expense and image from Firestore Database from the image in receipt gallery
export async function deleteFileByImage(url) {
    // Just to check url and reference to it in Firebase Storage to make sure we got the right things
    console.log(url);
    console.log(ref(storage, url));

    // Query the user's expenses in Firestore Database to find the expense with the same image url saved to it
    const q = query(collection(db, `Users/${auth.currentUser.email}/Expenses`), where("url", "==", url));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        // Delete the expense from Firestore Database whose url matches the selected image
        deleteDoc(doc.ref).then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.log("Error removing document: ", error);
        });
    })
    //Delete the image from Firebase Storage
    deleteObject(ref(storage, url)).then(() => {
        console.log("Image successfully deleted!");
    }).catch((error) => {
        console.log("Error removing image: ", error);
    })
}