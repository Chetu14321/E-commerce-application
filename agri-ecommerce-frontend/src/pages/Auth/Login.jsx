import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

export default function Login() {
    const [user, setUser] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLogin, setToken } = useAuth();

    const readInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/users/login`, user);
            toast.success(res.data.msg);
            setToken(res.data.token);
            setIsLogin(true);

            const redirectTo = new URLSearchParams(location.search).get("redirectTo");
            if (res.data.role === "admin") {
                navigate("/dashboard/admin");
            } else if (redirectTo) {
                navigate(redirectTo);
            } else {
                navigate("/dashboard/user");
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || err.message);
        }
    };

    return (
        <div style={styles.bg} className="d-flex justify-content-center align-items-center">
            <div className="p-5 rounded-4 shadow-lg animate__animated animate__fadeIn" style={styles.glass}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={styles.title}>Welcome Back</h2>
                    <p className="text-white-75">Login to your account</p>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="text-white">Email</label>
                        <input
                            type="email"
                            className="form-control text-dark border-0"
                            id="email"
                            name="email"
                            placeholder="you@example.com"
                            value={user.email}
                            onChange={readInput}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="password" className="text-white">Password</label>
                        <input
                            type="password"
                            className="form-control text-dark border-0"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={readInput}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div className="d-grid gap-2 mb-3">
                        <button type="submit" className="btn btn-primary fw-semibold">Login</button>
                        <button type="reset" className="btn btn-outline-light">Clear</button>
                    </div>
                    <div className="text-center">
                        <button
                            type="button"
                            className="btn btn-link text-white text-decoration-none"
                            onClick={() => navigate("/Forgotpassword")}
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-white-75">Don't have an account?</span>
                        <button
                            type="button"
                            className="btn btn-link text-white text-decoration-none ms-2"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    bg: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2C5364, #203A43, #0F2027)",
        padding: "20px",
    },
    glass: {
        width: "100%",
        maxWidth: "400px",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
    },
    title: {
        color: "#ffffff",
        fontWeight: "700",
    },
    input: {
        background: "white",  // White background for inputs
        borderRadius: "8px",
        padding: "10px",
        border: "1px solid #ffffff",  // White border
        transition: "border 0.3s ease",
    },
};
