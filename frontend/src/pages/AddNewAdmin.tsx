import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";

const url = import.meta.env.VITE_URL;

const AddNewAdmin = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const createAdminAccount = async (e: React.FormEvent<HTMLFormElement>) => {
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
                        navigate("/admins");
                    }, 1500);
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
        <div className="bg-white p-4 rounded-lg m-2">
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-dark">
                Add new Admin
            </h2>
            <form onSubmit={createAdminAccount}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-dark">Name</p>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Email Address</p>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Password</p>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Contact Number</p>
                        <input
                            id="contactNumber"
                            name="contactNumber"
                            type="text"
                            autoComplete="current-contactnumber"
                            required
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Secret Key</p>
                        <input
                            id="secretKey"
                            name="secretKey"
                            type="password"
                            required
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                </div>
                <div className="mt-4 space-x-4">
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                    >
                        {loading ? (
                            <PulseLoaderComponent size={15} color="#FFFBF5" />
                        ) : (
                            "Create New Admin"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewAdmin;
