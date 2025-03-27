import React, { useState } from "react"; // Import React and useState hook
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase authentication methods
import { auth } from '../../firebase'; // Import Firebase authentication instance
import { Link, useNavigate } from 'react-router-dom'; // Import navigation tools from React Router
import "./Login.css"; // Import CSS for styling
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome for icons
import Swal from 'sweetalert2'; // Import SweetAlert2 for styled alerts

export const Login = () => {
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [email, setEmail] = useState(''); // State for storing email input
    const [password, setPassword] = useState(''); // State for storing password input
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    // Function to handle login form submission
    const onLogin = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        signInWithEmailAndPassword(auth, email, password) // Firebase authentication method
            .then((userCredential) => {
                const user = userCredential.user; // Retrieve the signed-in user
                if (user.emailVerified) { // Check if the email is verified
                    navigate("/Home"); // Navigate to the Home page
                    Swal.fire({ // Show success alert
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome to ExpenseTracker!',
                        confirmButtonText: 'Okay'
                    });
                } else {
                    Swal.fire({ // Show error alert if email is unverified
                        icon: 'error',
                        title: 'Unverified Email',
                        text: 'Please verify your email address before logging in.',
                        confirmButtonText: 'Okay'
                    });
                }
                console.log(user); // Log user details (for debugging)
            })
            .catch((error) => { // Handle login errors
                const errorCode = error.code; // Extract error code
                const errorMessage = error.message; // Extract error message
                console.log(errorCode, errorMessage); // Log error details (for debugging)
                Swal.fire({ // Show error alert for invalid credentials
                    icon: 'error',
                    title: 'Invalid Credentials',
                    text: 'Invalid Email or Password.\nPlease try again.',
                    confirmButtonText: 'Okay'
                });
            });
    };

    // Function to handle password reset request
    const onForgotPassword = () => {
        if (!email) { // Check if email input is empty
            Swal.fire({ // Show warning if no email is entered
                icon: 'warning',
                title: 'Email Required',
                text: 'Please enter your email address to reset your password.',
                confirmButtonText: 'Okay'
            });
            return; // Exit the function
        }
        sendPasswordResetEmail(auth, email) // Firebase method to send password reset email
            .then(() => { // Show success alert if email is sent
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Email Sent',
                    text: `A password reset email has been sent to ${email}.`,
                    confirmButtonText: 'Okay'
                });
            })
            .catch((error) => { // Handle errors during password reset
                console.error(error.code, error.message); // Log error details (for debugging)
                Swal.fire({ // Show error alert
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to send password reset email. Please try again later.',
                    confirmButtonText: 'Okay'
                });
            });
    };

    return (
        <>
            <div className="form-background">
                <form>
                    {/* Email input field */}
                    <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                        />
                    </div>
                    
                    {/* Password input field with toggle visibility */}
                    <div className="password-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"} // Toggles between text and password type
                            required
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                        />
                        <span
                            className="toggle-password-visibility"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash"></i> // Closed eye icon for hiding password
                            ) : (
                                <i className="fas fa-eye"></i> // Open eye icon for showing password
                            )}
                        </span>
                    </div>
                    
                    {/* Login button */}
                    <div>
                        <button className="submit-button" onClick={onLogin}>Log In</button>
                    </div>
                </form>

                {/* Link to signup page */}
                <p>
                    Don't have an account? <Link to="/Signup">Sign up here</Link>
                </p>
                
                {/* Link for password reset */}
                <p>
                    Forgot your password?{" "}
                    <span
                        className="forgot-password-link"
                        onClick={onForgotPassword} // Trigger password reset on click
                        style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                    >
                        Reset it here
                    </span>
                </p>
            </div>
        </>
    );
};
