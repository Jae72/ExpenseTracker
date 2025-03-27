import React, { useEffect, useState } from "react";
import './NavBar.css';
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from '../../firebase'; // Import your firebase auth instance
import { signOut } from 'firebase/auth'; // Import signOut function

// Creates the main function for the nav bar
const NavBar = () => {

    // These constant functions ensure that the user is logged in and is able to log out
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // This constant is set for the responsive nav bar which does not function at the moment
    const [menuOpen, setMenuOpen] = useState(false)

    // useEffect checks to ensure user is logged in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLoggedIn(!!user); // Set true if user is logged in
        });

        return () => unsubscribe();
    }, []);

    // This const handles the logout feature, and will sign them off to the login page
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login"); // Navigates to login after logging out
        } catch (error) {
            console.error("Error logging out:", error); // Return to console if there is an error
        }
    };

    // Returns the actual nav bar display to the user 
    return (
        <header className="header">
            {/* ExpenseTracker logo */}
            <NavLink to="/" className="logo">ExpenseTracker</NavLink>

            <nav className="navbar">
                {/* Responsive menu */}
            <div className="menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}></ul>

                {/* Links to each page which uses react-router */}
                <NavLink to="/scanner" className={({ isActive }) => isActive ? 'active' : ''}>Scan Here!</NavLink>
                <NavLink to="/budget" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>

                <NavLink to="/prediction" className={({ isActive }) => isActive ? 'active' : ''}>Prediction</NavLink> {/* testing algorithm */}
                <NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : ''}>Receipt Gallery</NavLink>

                {/* When logged in, the far right link will become 'Logout' */}
                {isLoggedIn ? (
                    <NavLink to="/login" onClick={handleLogout}>Logout</NavLink>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
                )}
            </nav>
        </header>
    );
};

export default NavBar;
