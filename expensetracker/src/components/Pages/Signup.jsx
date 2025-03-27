import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, saveUser } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import "./Signup.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome
import Swal from 'sweetalert2'

// Exports functions for user sign up to create a new account
export const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(''); // State for email field
    const [password, setPassword] = useState(''); // State for password field
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password field

    const [showPassword, setShowPassword] = useState(false);  // State for toggling password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password field

    // States for password validation checkboxes
    const [isUppercase, setIsUppercase] = useState(false);
    const [isLowercase, setIsLowercase] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isSymbol, setIsSymbol] = useState(false);
    const [isMinLength, setIsMinLength] = useState(false);

    // Regular expressions for each password requirement
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const symbolRegex = /[@$!%*?&#]/;
    const minLengthRegex = /^.{6,}$/;

    // Check password requirements as user types
    useEffect(() => {
        setIsUppercase(uppercaseRegex.test(password));
        setIsLowercase(lowercaseRegex.test(password));
        setIsNumber(numberRegex.test(password));
        setIsSymbol(symbolRegex.test(password));
        setIsMinLength(minLengthRegex.test(password));
    }, [password]);

    // This constant function will be run when the Sign Up button is pressed
    const onSignUp = async (e) => {
        e.preventDefault();

        // Check to make sure password and confirm password match
        if (password !== confirmPassword) {
            Swal.fire({
                icon:'error',
                title: 'Passwords do not match!',
                confirmButtonText: 'Okay'
            })
            return;
        }

        // Check to make sure all password requirements are met
        if (!isUppercase || !isLowercase || !isNumber || !isSymbol || !isMinLength) {
            Swal.fire({
                icon:'error',
                title: 'Please meet all password requirements.',
                confirmButtonText: 'Okay'
            })
            return;
        }

        await createUserWithEmailAndPassword(auth, email, password) //Firebase Authentication function to create new user
            .then((userCredential) => {
                const user = userCredential.user;
                sendEmailVerification(user) // Firebase Authentication function to send a verification email to the user
                    .then(() => {
                        console.log('Verification email sent.');
                        saveUser(user.uid, email).then(() => { // This functino is defined in firebase.jsx
                            navigate("/Login"); // Send the user to the Login page
                            Swal.fire({ // Sweet Alert to notify the user of verification email
                                icon:'success',
                                title: 'A verification email has been sent!',
                                confirmButtonText: 'Okay'
                            })
                        });
                    })
                    .catch((error) => {
                        console.error('Error sending verification email:', error);
                    });
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                if(errorCode == "auth/email-already-in-use") { // Handle user email already in use
                    Swal.fire({
                        icon:'error',
                        title: 'Email is already in use! Please verify or try a different email.',
                        confirmButtonText: 'Okay'
                    })
                }else{
                    Swal.fire({ // Handle all other errors
                        icon:'error',
                        title: 'Invalid Email or Password.\nPlease try again.',
                        confirmButtonText: 'Okay'
                    })
                }
            });
    };

    return (
        <>
            <div className="form-background">
                <form>
                    {/* Email Address */}
                    <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* Password */}
                    <div className="password-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"} // Toggle password visibility
                            required
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="toggle-password-visibility"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash"></i> // Closed eye icon
                            ) : (
                                <i className="fas fa-eye"></i> // Open eye icon
                            )}
                        </span>
                    </div>

                    {/* Password Requirements Checkboxes */}
                    <div className="password-requirements">
                        <div className={`requirement ${isUppercase ? 'met' : ''}`}>
                            <span className="checkbox"></span>
                            <label>At least one uppercase letter (A-Z)</label>
                        </div>
                        <div className={`requirement ${isLowercase ? 'met' : ''}`}>
                            <span className="checkbox"></span>
                            <label>At least one lowercase letter (a-z)</label>
                        </div>
                        <div className={`requirement ${isNumber ? 'met' : ''}`}>
                            <span className="checkbox"></span>
                            <label>At least one number (0-9)</label>
                        </div>
                        <div className={`requirement ${isSymbol ? 'met' : ''}`}>
                            <span className="checkbox"></span>
                            <label>At least one special symbol (@$!%*?&#)</label>
                        </div>
                        <div className={`requirement ${isMinLength ? 'met' : ''}`}>
                            <span className="checkbox"></span>
                            <label>At least 6 characters long</label>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="password-container">
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                            required
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                            className="toggle-password-visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <i className="fas fa-eye-slash"></i> // Closed eye icon for hiding password
                            ) : (
                                <i className="fas fa-eye"></i> // Open eye icon for showing password
                            )}
                        </span>
                    </div>

                    <div>
                        <button className="submit-button" type="submit" onClick={onSignUp}>Sign Up</button>
                    </div>
                </form>
                <p>
                    {/* Switch to login */}
                    Already have an account? <Link to="/Login" className="switch-to-login-link">Log In</Link>
                </p>
            </div>
        </>
    );
};
