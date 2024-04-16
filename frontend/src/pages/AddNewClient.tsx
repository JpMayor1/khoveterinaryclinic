import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AddNewClient = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [cpNumber, setCpNumber] = useState("");
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const convertBase64 = (file: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const selectImage = async (
        event: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const files = event.target.files;

        if (files && files.length > 0) {
            const base64 = await convertBase64(files[0]);
            setImageUrl(base64);
            setImage(files[0]);
        }
    };

    const createClientAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isNaN(Number(cpNumber)) || cpNumber.charAt(0) !== "0") {
                toast.error(
                    "Please enter a valid contact number, Ex: 09XXXXXXXXX"
                );
                setLoading(false);
                return;
            }

            if (cpNumber.length < 11 || cpNumber.length > 11) {
                toast.error("Number must be exact 11 digits");
                setLoading(false);
                return;
            }

            let imageUrl = "";
            if (image) {
                const formData = new FormData();
                formData.append("image", image);

                const response = await axios.post(
                    `${url}/api/image/upload`,
                    formData
                );
                imageUrl = url + "/images/" + response.data.imageUrl;
            }

            await axios.post(`${url}/api/clients/create`, {
                image: imageUrl,
                name,
                email,
                password,
                location,
                cpNumber,
                balance,
            });

            toast.success("Client created successfully");
            setLoading(false);
            setTimeout(() => {
                navigate("/clients");
            }, 1500);
        } catch (error) {
            console.error("Error creating client:", error);
            toast.error("Failed to create client. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg m-2">
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-dark">
                Add new Client
            </h2>
            <form onSubmit={createClientAccount}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="w-full flex flex-col gap-2">
                        <div className="w-[300px] flex items-center justify-center mx-auto">
                            {image ? (
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-[300px] h-[300px] border border-dark rounded-lg cursor-pointer overflow-hidden"
                                >
                                    <div className="relative h-full w-full">
                                        <img
                                            src={imageUrl}
                                            alt="product"
                                            className="w-full h-[300px] object-cover rounded-lg"
                                        />
                                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-light hover:bg-light/90 text-dark px-7 py-2 rounded-md">
                                            Change
                                        </div>
                                    </div>
                                    <input
                                        onChange={selectImage}
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            ) : (
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-[300px] h-[300px] border border-dark rounded-lg cursor-pointer overflow-hidden"
                                >
                                    <div className="flex flex-col flex-wrap items-center justify-center p-3">
                                        <svg
                                            aria-hidden="true"
                                            className="w-10 h-10 mb-3 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            ></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            JPEG, JPG, PNG up to 20MB
                                        </p>
                                    </div>
                                    <input
                                        onChange={selectImage}
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <div>
                            <p className="text-dark">Full Name</p>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={name}
                                placeholder="Ex: Mark Christian Par"
                                onChange={(e) => setName(e.target.value)}
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
                                placeholder="Ex: parmarkchristian@gmail.com"
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
                                onChange={(e) => setPassword(e.target.value)}
                                className="rounded-md p-2 border w-full"
                            />
                        </div>
                        <div>
                            <p className="text-dark">Location</p>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={location}
                                placeholder="Ex: P1, Brgy. Lag-on, Daet, Camarines Norte"
                                onChange={(e) => setLocation(e.target.value)}
                                className="rounded-md p-2 border w-full"
                            />
                        </div>
                        <div>
                            <p className="text-dark">Contact number</p>
                            <input
                                id="cpNumber"
                                name="cpNumber"
                                type="text"
                                required
                                value={cpNumber}
                                placeholder="Ex: 09XXXXXXXXX"
                                onChange={(e) => setCpNumber(e.target.value)}
                                className="rounded-md p-2 border w-full"
                            />
                        </div>
                        <div>
                            <p className="text-dark">Balance</p>
                            <input
                                id="balance"
                                name="balance"
                                type="number"
                                required
                                value={balance}
                                placeholder="Client's balance"
                                onChange={(e) =>
                                    setBalance(parseFloat(e.target.value))
                                }
                                className="rounded-md p-2 border w-full"
                            />
                        </div>
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
                            "Create New Client"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewClient;
