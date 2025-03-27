import React, { useEffect, useState } from "react";
import ExpenseForm from "../ExpenseForm/ExpenseForm";
import ExpenseTable from "../ExpenseTable/ExpenseTable";
import "./Budget.css";
import { getExpenses } from "../../firebase";
import ExpenseInfo from "../ExpenseInfo/ExpenseInfo";

export const Budget = ({ isAuthenticated }) => {
    // date of today
    const todayDate = new Date();

    // state to store expenses
    const [expenses, setExpenses] = useState([]);
    // state to store if user is editing the expense
    const [isEditing, setIsEditing] = useState(null);
    // state to store the selected month
    const [selectedMonth, setSelectedMonth] = useState(todayDate.getMonth() + 1);
    // state to store selected year
    const [selectedYear, setSelectedYear] = useState(todayDate.getFullYear());
    // state to store the selected category by the user
    const [selectedCategory, setSelectedCategory] = useState("");
    // state to store recent expense that has been edited or added
    const [recentExpense, setRecentExpense] = useState(null);

    // fetch expenses from the database
    const fetchExpenses = async () => {
        setExpenses(await getExpenses());
    };

    useEffect(() => {
        // check if user is authenticated
        if (isAuthenticated) {
            fetchExpenses();
        }
    }, [isAuthenticated]);

    // Reset filters function
    const resetFilters = () => {
        setSelectedMonth(0); // Reset to indicate "all months"
        setSelectedYear(0);  // Reset to indicate "all years"
        setSelectedCategory(""); // Reset to indicate "all categories"
    };

    // Filter expenses based on selected month, year, and category
    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = expenseDate.getMonth() + 1;
        const expenseYear = expenseDate.getFullYear();
        const expenseCategory = expense.category;

        return (
            (selectedMonth === 0 || expenseMonth === selectedMonth) &&
            (selectedYear === 0 || expenseYear === selectedYear) &&
            (selectedCategory === "" || expenseCategory === selectedCategory)
        );
    });

    return (
        <div className="expense-container">
            <ExpenseForm
                fetchExpenses={fetchExpenses}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setRecentExpense={setRecentExpense}
            />
            <div className="expense-table-and-info">
                {expenses && expenses.length && <ExpenseInfo
                    expenses={expenses}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    selectedCategory={selectedCategory} // Pass selectedCategory to ExpenseInfo
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                    onCategoryChange={setSelectedCategory} // Add handler for category change
                    onResetFilters={resetFilters}
                />
                }
                <ExpenseTable
                    expenses={filteredExpenses}
                    fetchExpenses={fetchExpenses}
                    setIsEditing={setIsEditing}
                    recentExpense={recentExpense}
                />
            </div>
        </div>
    );
};
