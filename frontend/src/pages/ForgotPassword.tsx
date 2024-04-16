import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [success, setSuccess] = useState(false);
    const [codeSubmitted, setCodeSubmitted] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();

    const forgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send a POST request to your backend API to initiate the password reset
            await axios
                .post(`${url}/api/auth/forgot-password`, {
                    email,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setCodeSubmitted(true);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const resetPassword = async () => {
        try {
            // Send a POST request to your backend API to reset the password
            await axios
                .post(`${url}/api/auth/reset-password`, {
                    email,
                    resetPasswordCode: code,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setSuccess(true);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setSuccess(false);
                });
        } catch (error) {
            console.log(error);
            setSuccess(false);
        } finally {
            setCode("");
        }
    };

    const changePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Send a PUT request to your backend API to reset the password
            await axios
                .put(`${url}/api/auth/new-password`, {
                    email,
                    newPassword,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setTimeout(() => {
                        navigate("/auth/login");
                    }, 3001);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                });
        } catch (error) {
            console.log(error);
        } finally {
            setNewPassword("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            {success ? (
                <form onSubmit={changePassword} className="mb-8">
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block mb-2">
                            New Password:
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="border rounded-md px-2 py-1 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/70 text-light font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            ) : codeSubmitted ? (
                <div>
                    <p className="mb-2">
                        Enter the code sent to your phone number:
                    </p>
                    <div className="flex flex-col gap-3 items-center">
                        <div className="flex">
                            <input
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="border rounded-md px-2 py-1 w-full"
                            />
                        </div>
                        <button
                            className="bg-primary hover:bg-primary/70 text-light font-bold py-2 px-4 rounded"
                            onClick={resetPassword}
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={forgotPassword} className="mb-8">
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border rounded-md px-2 py-1 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/70 text-light font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
