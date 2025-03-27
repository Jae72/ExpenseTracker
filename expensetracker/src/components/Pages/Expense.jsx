import React, { useEffect, useState } from "react"; // Import React and necessary hooks
import ExpenseForm from "../ExpenseForm/ExpenseForm"; // Import ExpenseForm component
import ExpenseTable from "../ExpenseTable/ExpenseTable"; // Import ExpenseTable component

import "./Expense.css"; // Import CSS for styling
import { getExpenses } from "../../firebase"; // Import Firebase function to fetch expenses

// Expense component to manage and display the list of expenses
export const Expense = ({ isAuthenticated }) => {
    const [expenses, setExpenses] = useState([]); // State to store the list of expenses
    const [isEditing, setIsEditing] = useState(null); // State to track which expense is being edited

    // Function to fetch expenses from the database
    const fetchExpenses = async () => {
        setExpenses(await getExpenses()); // Fetch and update expenses in the state
    };

    // useEffect to fetch expenses when the user is authenticated
    useEffect(() => {
        if (isAuthenticated) { // Ensure the user is authenticated before fetching data
            fetchExpenses(); // Fetch the expenses
        }
    }, [isAuthenticated]); // Dependency array ensures this effect runs when isAuthenticated changes

    return (
        <div className="expense-container"> {/* Main container for the Expense component */}
            {/* ExpenseForm component for adding or editing expenses */}
            <ExpenseForm
                fetchExpenses={fetchExpenses} // Pass fetchExpenses function to refresh the list after adding/editing
                isEditing={isEditing} // Pass the editing state to the form
                setIsEditing={setIsEditing} // Function to update the editing state
            />
            {/* ExpenseTable component to display the list of expenses */}
            <ExpenseTable
                expenses={expenses} // Pass the list of expenses to the table
                fetchExpenses={fetchExpenses} // Pass fetchExpenses function to refresh the list after deletion
                setIsEditing={setIsEditing} // Function to update the editing state (for selecting an expense to edit)
            />
        </div>
    );
};
