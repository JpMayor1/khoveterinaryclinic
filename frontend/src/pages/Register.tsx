import { useState } from "react";
import { toast } from "react-toastify";
import { FaPaw } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const registerAdminAccount = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (
                isNaN(Number(contactNumber)) ||
                contactNumber.charAt(0) !== "0"
            ) {
                toast.error(
                    "Please enter a valid contact number, Ex: 09XXXXXXXXX"
                );
                setLoading(false);
                return;
            }

            if (contactNumber.length < 11 || contactNumber.length > 11) {
                toast.error("Number must be exact 11 digits");
                setLoading(false);
                return;
            }

            await axios
                .post(`${url}/api/register`, {
                    username,
                    email,
                    password,
                    contactNumber,
                    secretKey,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setLoading(false);
                    setTimeout(() => {
                        navigate("/auth/login");
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
            <div className="h-fit w-full lg:h-[150px] lg:w-[300px] xl:w-[400px] flex flex-col items-center justify-start my-2 p-5">
                <h1 className="text-primary text-2xl lg:text-3xl">
                    KHO VETERINARY CLINIC
                </h1>
                <div className="flex items-center gap-1 text-dark text-xl lg:text-2xl">
                    <p>Stay</p>
                    <FaPaw />
                    <p>-sitive</p>
                </div>
            </div>
            <form
                className="h-[90%] w-[90%] lg:h-[90%] lg:w-[450px] xl:h-fit xl:w-[450px] bg-cyan-blue relative flex flex-col items-center justify-center p-4 mt-2"
                onSubmit={registerAdminAccount}
            >
                <div className="h-[70px] w-[70px] absolute top-5 left-5">
                    <img
                        src="/logo.jpg"
                        alt="logo"
                        className="h-full w-full rounded-full"
                    />
                </div>
                <div className="w-full mb-2 mt-20">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-dark"
                    >
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="w-full mb-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-dark"
                    >
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="w-full mb-2">
                    <div className="flex items-center">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-dark"
                        >
                            Password
                        </label>
                    </div>
                    <div className="mt-2">
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

                <div className="w-full mb-2">
                    <div className="flex items-center">
                        <label
                            htmlFor="contactNumber"
                            className="block text-sm font-medium leading-6 text-dark"
                        >
                            ContactNumber
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="contactNumber"
                            name="contactNumber"
                            type="text"
                            required
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="w-full mb-2">
                    <div className="flex items-center">
                        <label
                            htmlFor="secretKey"
                            className="block text-sm font-medium leading-6 text-dark"
                        >
                            Secret Key
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="secretKey"
                            name="secretKey"
                            type="password"
                            required
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
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
                            <PulseLoaderComponent size={20} color="#FFFBF5" />
                        ) : (
                            "Sign up"
                        )}
                    </button>
                </div>
                <p className="mt-5 text-center text-sm lg:text-lg">
                    Already have an Account?{" "}
                    <Link
                        to="/auth/login"
                        className="font-semibold leading-6 text-primary hover:text-primary/75 "
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
