import React from "react";
import "./ExpenseTable.css";
import { removeExpense } from "../../firebase";
import { Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";

const ExpenseTable = ({ expenses, fetchExpenses, setIsEditing, selectedMonth, selectedYear, recentExpense }) => {
    // when user deletes expense
    const onDeleteExpense = async (expense) => {
        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to Delete this expense?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "No, keep it",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await removeExpense(expense);
                fetchExpenses();
            }
        })
    };

    // when user edits expense
    const onEditExpense = (expense) => {
        setIsEditing(expense);
        // take the user to top of the page when user edits expense
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // format date 
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            timeZone: 'UTC'
        });
    };

    // filter expenses
    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth() + 1;
        const expenseYear = expenseDate.getFullYear();

        return (
            (selectedMonth ? expenseMonth === parseInt(selectedMonth) : true) &&
            (selectedYear ? expenseYear === parseInt(selectedYear) : true)
        );
    });

    // show the receipt details in the table
    const showDetails = (expense) => {
        // add expense url as receipt image
        document.getElementById('receipt-image').src = expense.url;
        // display the modal on screen
        document.getElementById('view-modal').style.display = "block";
    }

    // close the modal
    const closeViewModal = () => {
        document.getElementById('view-modal').style.display = "none";
    }

    // hide the modal when 'view-modal' element is clicked
    window.onclick = function(event) {
        if (event.target == document.getElementById('view-modal')){
            document.getElementById('view-modal').style.display = "none";
        }
    }

    return (
        <><table className="expense-table" cellSpacing={0}>
            <thead>
                <tr className="expense-row">
                    <th>Date</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Receipt</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredExpenses.map((expense) => (
                    <tr className={`expense-row${recentExpense === expense.id ? ' recent-expense' : ''}`} key={expense.id}>
                        <td>{formatDate(expense.date)}</td>
                        <td>{expense.store ? expense.store : " "}</td>
                        <td>{expense.category}</td>
                        <td>${expense.price}</td>
                        <td>{expense.url ? <button onClick={() => showDetails(expense)} className="link-button">View Receipt</button> : " "}</td>
                        <td>
                            <div className="expense-actions">
                                <button onClick={() => onEditExpense(expense)} className="link-button"><i className="fa-solid fa-pen-to-square"></i></button>
                                <button onClick={() => onDeleteExpense(expense)} className="link-button"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <div id="view-modal" className="modal">
            <div className="modal-content">
                <span onClick={() => closeViewModal()} className="close" id="close-view-modal">&times;</span>
                <h2>Receipt Details</h2>
                <div id="receipt-details">                
                    <img id="receipt-image" src="" alt="Receipt Image"></img>
                    <p id="receipt-info"></p>
                </div>
            </div>
        </div></>
    );
};

export default ExpenseTable;