import React, { useEffect, useState } from 'react'
import './Registration.css'

import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'

export const Registration = () => {

    const [action,setAction] = useState ("Login");
    const [currentPage, setCurrentPage] = useState("home");

    const handleHomeClick = () => {
        setCurrentPage("home");
        setAction("Login");
    }; 
    
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

                <div className="inputs">
                    {action === "Login" ? <div></div> :
                        <div className="input">   
                            <img src={user_icon} alt=""></img>
                            <input type="text" placeholder="Name" />
                        </div>
                    }
                    
                    <div className="input">   
                        <img src={email_icon} alt=""></img>
                        <input type="email" placeholder="Email"/>
                    </div>

                    <div className="input">   
                        <img src={password_icon} alt=""></img>
                        <input type="password" placeholder="Password"/>
                    </div>  
                </div>

                {action === "Sign Up" ? <div></div> :  
                    <div className="forget_password">Forgot password ? <span>Click Here!</span> </div>
                }

                {action === "Login" ? 
                    <div className="new_account">Don't have an account ? <span onClick={()=>{setAction("Sign Up")}}>Click Here!</span> </div>
                    : <div></div>
                }

                <div className="submit-container">
                    {action === "Login" ? 
                        <div className="submit" onClick={()=>{setAction("Login")}}>
                            Login
                        </div>
                        :
                        <div className="submit" onClick={()=>{setAction("Sign Up")}}>
                            Sign Up
                        </div>
                    }            
                </div>
            </div>
        </div>
    )
}