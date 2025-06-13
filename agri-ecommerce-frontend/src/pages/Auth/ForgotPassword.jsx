import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
// import { useRouter } from "next/router";
 import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // Step 1: Email | Step 2: OTP & Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    // const router = useRouter();
    const navigate = useNavigate();





    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/users/forgot", { email });
            toast.success(res.data.msg);
            setStep(2); // Move to OTP step
        } catch (err) {
            toast.error(err.response?.data?.msg || "Something went wrong!");
        }
    };

    // Step 2: Verify OTP & Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch("/api/users/update", { email, otp, password: newPassword });
            toast.success(res.data.msg);
            navigate("/login"); // Redirect to login after reset
        } catch (err) {
            toast.error(err.response?.data?.msg || "Something went wrong!");
        }
    };

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <h6 className="display-6 text-secondary">Forgot Password</h6>
                        </div>
                        <div className="card-body">
                            {step === 1 ? (
                                <form onSubmit={handleSendOtp}>
                                    {/* Step 1: Enter Email */}
                                    <div className="form-group mt-2">
                                        <label htmlFor="email">Enter Your Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3 text-center">
                                        <button type="submit" className="btn btn-outline-primary">
                                            Send OTP
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword}>
                                    {/* Step 2: Enter OTP */}
                                    <div className="form-group mt-2">
                                        <label htmlFor="otp">Enter OTP</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="otp"
                                            name="otp"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {/* Step 2: Enter New Password */}
                                    <div className="form-group mt-2">
                                        <label htmlFor="newPassword">Enter New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3 text-center">
                                        <button type="submit" className="btn btn-outline-success">
                                            Reset Password
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
