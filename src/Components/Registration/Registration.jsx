import React, { useEffect, useState } from 'react'
import './Registration.css'
import Dashboard from '../Dashboard/Dashboard'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

export const Registration = () => {

    const [action, setAction] = useState("Login");
    const [currentPage, setCurrentPage] = useState("home");
    const [user, setUser] = useState(null); 

    // Form data state to store form input variables when use  is completing forms
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', 
        role: 'doctor' 
    });
    
    // Loading and error states to handle the user feedback during the form submission
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user is already logged in when the page is reloaded 
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            setCurrentPage("dashboard");
        }
    }, []);

    // Sets the user back to the homepage when they click on "WHDR (the home button)" on the navbar
    const handleHomeClick = () => {
        setCurrentPage("home");
        setAction("Login");
        setFormData({ name: '', email: '', password: '', role: 'doctor' });
        setError('');
        setSuccess('');
    };


    // Logs the user out and cleans up everything 
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setCurrentPage("home");
        setAction("Login");
        setFormData({ name: '', email: '', password: '', role: 'doctor' });
        setError('');
        setSuccess('');
    };

    // Handles input changes and update form data when user types in any input fields
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    // Handles form submission
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {

            // Sends the right registration/login to the right api endpoint
            const url = action === "Login" 
                ? 'http://localhost:8000/api/auth/login/'
                : 'http://localhost:8000/api/auth/register/';

            // Different payloads for login vs registration
            const payload = action === "Login" 
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password, role: formData.role };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(action === "Login" ? 'Login successful!' : 'Registration successful!');
                
                // Store token and user data (includes role from backend)
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                
                // Redirect to dashboard
                setTimeout(() => {
                    setCurrentPage("dashboard");
                    setFormData({ name: '', email: '', password: '', role: 'doctor' });
                    setSuccess('');
                }, 1500);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Hit the enter the button to submit the login/registration form
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !loading) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Show dashboard if user is logged in
    if (currentPage === "dashboard" && user) {
        return <Dashboard user={user} onLogout={handleLogout} />;
    }
    
    if (currentPage === "home") {
        return (
            <div>
                <nav className="navbar">
                    <div className="nav-brand" onClick={handleHomeClick} style={{cursor: 'pointer'}}>WHDR</div>
                    <ul className="nav-links">
                        <li><a href="#" onClick={() => setCurrentPage("auth")}>Login</a></li>
                    </ul>
                </nav>
                <div className="home-content">
                    <h1>Welcome to Health Directory Registry</h1>
                    <p>Query patient's records with ease</p>
                    <button onClick={() => setCurrentPage("auth")}>Get Started</button>
                </div>
            <footer className="footer">
                <p>© 2025 Health Directory Registry. All rights reserved | yaw</p>
            </footer>                
            </div>
        );
    }

    return (
        <div>
            <nav className="navbar">
                <div className="nav-brand" onClick={handleHomeClick} style={{cursor: 'pointer'}}>WHDR</div>
                <ul className="nav-links"></ul>
            </nav>
            
            <div className='container'>
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="inputs">
                    {action === "Login" ? <div></div> :
                        <div className="input">   
                            <img src={user_icon} alt=""></img>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Name" 
                                value={formData.name}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown} 
                            />
                        </div>
                    }
                    
                    <div className="input">   
                        <img src={email_icon} alt=""></img>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}

                        />
                    </div>

                    <div className="input">   
                        <img src={password_icon} alt=""></img>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>


                    {action === "Sign Up" ? 
                        <div className="input">   
                            <select 
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    width: '100%',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="doctor">Doctor</option>
                                <option value="nurse">Nurse</option>
                                {/* <option value="admin">Administrator</option> */}
                            </select>
                        </div>
                    : <div></div>}
                </div>

                {/* {action === "Sign Up" ? <div></div> :  
                    <div className="forget_password">Forgot password ? <span>Click Here!</span> </div>
                } */}

                {action === "Login" ? 
                    <div className="new_account">Don't have an account ? <span onClick={()=>{setAction("Sign Up")}}>Register Here!</span> </div>
                    : <div></div>
                }

                <div className="submit-container">
                    <div 
                        className={`submit ${loading ? 'loading' : ''}`} 
                        onClick={loading ? null : handleSubmit}
                    >
                        {loading ? 'Processing...' : action === "Login" ? 'Login' : 'Sign Up'}
                    </div>           
                </div>
            </div>
        </div>
    )
}