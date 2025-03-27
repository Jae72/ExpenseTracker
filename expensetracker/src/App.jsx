import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import { Scanner } from "./components/Pages/Scanner.jsx";
import { Budget } from "./components/Pages/Budget.jsx";
import { Upload } from "./components/Pages/Upload.jsx";
import { Login } from "./components/Pages/Login.jsx";
import { Signup } from "./components/Pages/Signup.jsx";
import { auth } from "./firebase"; // Firebase authentication import
import { getExpenses } from "./firebase"; // Function to fetch expenses
import PredictionAlgo from "./components/Pages/PredictionAlgo";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Ensures user is logged in and authenticated 
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]); // State to store fetched expenses
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Month starts from 1 (January)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year

  // Fetch expenses function
  const fetchExpenses = async () => {
    const fetchedExpenses = await getExpenses();
    setExpenses(fetchedExpenses);
  };

  // Authentication check
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set to true if a user is logged in
      setLoading(false); // Stop loading once auth state is determined

      if (user) {
        fetchExpenses(); // Fetch expenses if the user is authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Display a loading spinner while checking auth status
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Conditionally show the ExpenseTracker title only when not authenticated (login page) */}
      {!isAuthenticated && (
        <header
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "4rem",
            fontWeight: "bold",
          }}
        >
          ExpenseTracker
        </header>
      )}

      {/* Conditionally render the NavBar only if the user is authenticated */}
      {isAuthenticated && <NavBar />}

      <Routes>
        {/* Show login and signup pages if the user is not authenticated */}
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Redirect all other routes to login */}
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Show protected routes after login */}
            {/* Pass expenses, fetchExpenses, and filtering parameters to the Budget component*/}
            <Route
              path="/budget"
              element={
                <Budget
                  isAuthenticated={isAuthenticated}
                  expenses={expenses}
                  fetchExpenses={fetchExpenses}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthChange={setSelectedMonth}
                  onYearChange={setSelectedYear}
                />
              }
            />
            
            {/* Routes to each seperate component */}
            <Route path="/scanner" element={<Scanner />} />

            <Route path="/scanner" element={<Scanner />} />

            <Route path="/upload" element={<Upload />} />

            {/* Pass expenses to the PredictionAlgo component */}
            <Route path="/prediction" element={<PredictionAlgo expenses={expenses} />} />

            {/* Redirect the root path ("/") to "/budget" after login */}
            <Route path="/" element={<Navigate to="/budget" />} />
            <Route path="*" element={<Navigate to="/budget" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;