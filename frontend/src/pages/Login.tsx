import { useState } from "react";
import { toast } from "react-toastify";
import { FaPaw } from "react-icons/fa";
import { adminStore } from "../stores/adminStore";
import { Link, useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const addAdminInfo = adminStore((state) => state.addAdminInfo);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios
                .post(`${url}/api/login`, {
                    email,
                    password,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setLoading(false);

                    const info = {
                        _id: res.data.admin._id,
                        username: res.data.admin.username,
                        email: res.data.admin.email,
                        contactNumber: res.data.admin.contactNumber,
                        superAdmin: res.data.admin.superAdmin,
                        token: res.data.token,
                    };

                    addAdminInfo(info);

                    setTimeout(() => {
                        navigate("/");
                    }, 3001);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setLoading(false);
                });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-[url('/auth-bg2.png')] bg-cover bg-center flex flex-col justify-center items-center lg:flex-row lg:gap-10">
            {/* Text */}
            <div className="h-fit w-full lg:h-[150px] lg:w-[300px] xl:w-[400px] flex flex-col items-center justify-start my-2">
                <h1 className="text-primary text-2xl lg:text-3xl">
                    KHO VETERINARY CLINIC
                </h1>
                <div className="flex items-center gap-1 text-dark text-xl lg:text-2xl">
                    <p>Stay</p>
                    <FaPaw />
                    <p>-sitive</p>
                </div>
            </div>

            {/* login form */}
            <form
                className="h-[90%] w-[90%] lg:h-[90%] lg:w-[450px] xl:h-[80%] xl:w-[450px] bg-cyan-blue relative flex flex-col items-center justify-center p-4 mt-2"
                onSubmit={handleSubmit}
            >
                <div className="h-[70px] w-[70px] absolute top-5 left-5">
                    <img
                        src="/logo.jpg"
                        alt="logo"
                        className="h-full w-full rounded-full"
                    />
                </div>
                <div className="w-full mb-2 mt-9 xl:mt-24">
                    <label
                        htmlFor="email"
                        className="block text-sm lg:text-lg font-medium leading-6"
                    >
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 lg:text-lg"
                        />
                    </div>
                </div>

                <div className="w-full mb-2">
                    <div className="flex items-center">
                        <label
                            htmlFor="password"
                            className="block text-sm lg:text-lg font-medium leading-6 text-dark"
                        >
                            Password
                        </label>
                    </div>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex justify-center rounded-md bg-primary px-10 py-2 text-sm font-semibold leading-6 text-light shadow-sm hover:bg-primary/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark mt-2 lg:text-lg"
                    >
                        {loading ? (
                            <div className="xl:text-[28px]">
                                <PulseLoaderComponent
                                    size={20}
                                    color="#FFFBF5"
                                />
                            </div>
                        ) : (
                            "Log in"
                        )}
                    </button>
                </div>

                <p className="mt-5 text-center text-sm lg:text-lg">
                    Don't have an Account?{" "}
                    <Link
                        to="/auth/register"
                        className="font-semibold leading-6 text-primary hover:text-primary/75 "
                    >
                        Sign up
                    </Link>
                </p>
                <div className="mt-1 text-center">
                    <Link
                        to="/auth/forgot-password"
                        className="text-sm lg:text-lg text-dark hover:text-dark/75 cursor-pointer underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
