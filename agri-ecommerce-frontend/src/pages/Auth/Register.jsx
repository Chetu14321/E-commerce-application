import React, { useState } from "react";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
import axios from "axios"







export default function Register() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const Navigate=useNavigate()

    const readInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const submitHandler = async (e) => {
    e.preventDefault();

    // Basic mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(user.mobile)) {
        toast.error("Mobile number must be exactly 10 digits");
        return;
    }

    // Basic password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(user.password)) {
        toast.error("Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, and one number");
        return;
    }

    try {
        console.log("user", user);
        await axios.post(`/api/users/register`, user)
            .then(res => {
                toast.success("User Registered Successfully");
                Navigate('/login');
            })
            .catch(err => toast.error(err.response.data.msg));
    } catch (err) {
        toast.error(err.message);
    }
};

    

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <h6 className="display-6 text-secondary">Register</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={submitHandler}>
                                <div className="form-group mt-2">
                                    <label htmlFor="name">Your Name</label>
                                    <input type="text" className="form-control" id="name" name="name" placeholder="Enter Name" value={user.name}onChange={readInput} required/>
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="email">Your Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter email"
                                        value={user.email}
                                        onChange={readInput}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="mobile">Your Mobile</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="Enter mobile"
                                        value={user.mobile}
                                        onChange={readInput}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label htmlFor="password">Your Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={user.password}
                                        onChange={readInput}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <input
                                        type="submit"
                                        value="Register User"
                                        className="btn btn-outline-success"
                                    />
                                    <input
                                        type="reset"
                                        value="Clear"
                                        className="btn btn-outline-warning"
                                        
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}