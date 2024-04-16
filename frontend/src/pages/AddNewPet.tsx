import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ClientType } from "../utils/Types";
import { useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AddNewPet = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("");
    const [breed, setBreed] = useState("");
    const [species, setSpecies] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<ClientType[]>([] as ClientType[]);
    const [clientId, setClientId] = useState("");
    const [search, setSearch] = useState("");
    const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
    const [buttonLoading, setButtonLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getAllClients = async () => {
            setLoading(true);
            try {
                await axios
                    .get(`${url}/api/clients`)
                    .then((res) => {
                        toast.success(res.data.message);
                        setClients(res.data);
                        return;
                    })
                    .catch((err) => {
                        toast.error(err.response.data.message);
                        return;
                    });
            } catch (error) {
                console.log(error);
                return;
            } finally {
                setLoading(false);
            }
        };

        getAllClients();
    }, []);

    // const calculateAge = (birthdate: string) => {
    //     const today = new Date();
    //     const birthDate = new Date(birthdate);
    //     const diffInMilliseconds = Math.abs(
    //         today.getTime() - birthDate.getTime()
    //     );
    //     const years = Math.floor(
    //         diffInMilliseconds / (1000 * 60 * 60 * 24 * 365)
    //     );
    //     const months =
    //         Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.436875)) %
    //         12;
    //     const days =
    //         Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) % 30;

    //     if (years > 0) {
    //         return `${years} Year${years > 1 ? "s" : ""} old`;
    //     } else if (months > 0) {
    //         return `${months} Month${months > 1 ? "s" : ""} old`;
    //     } else {
    //         return `${days} Day${days > 1 ? "s" : ""} old`;
    //     }
    // };

    // const setBirthdateFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setBirthdate(e.target.value);
    //     setAge(calculateAge(e.target.value));
    // };

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

    const searchOwner = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setSearch(newQuery);
        const filtered = clients.filter((client) =>
            client.name.toLowerCase().includes(newQuery.toLowerCase())
        );
        if (newQuery === "") {
            setFilteredClients([]);
        } else {
            setFilteredClients(filtered);
        }
    };

    const createPet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonLoading(true);
        try {
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

            await axios
                .post(`${url}/api/pets/create`, {
                    clientId,
                    image: imageUrl,
                    name,
                    weight,
                    breed,
                    species,
                    gender,
                    age,
                    birthdate: birthdate ? new Date(birthdate) : "",
                    color,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setButtonLoading(false);
                    setTimeout(() => {
                        navigate("/pets");
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setButtonLoading(false);
                });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again.");
            setButtonLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <PulseLoaderComponent size={20} />
                </div>
            ) : clients.length === 0 ? (
                <h1 className="text-xl font-semibold">No clients found.</h1>
            ) : (
                <div className="bg-white p-4 m-2">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-dark">
                        Add new Pet
                    </h2>
                    <form onSubmit={createPet}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full flex items-center justify-center">
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

                                <div>
                                    <p className="text-dark">Name</p>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Example: Max"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="rounded-md p-2 border w-full"
                                    />
                                </div>

                                <div>
                                    <p className="text-dark">Gender</p>

                                    <select
                                        id="gender"
                                        value={gender}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                        className="rounded-md p-2 border w-full"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <div>
                                    <p className="text-dark">Select Owner</p>

                                    <div className="flex items-center space-x-2 relative">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={searchOwner}
                                            className="rounded-md p-2 border border-dark/70 w-full"
                                            placeholder="Search Client"
                                        />
                                        <div
                                            className={`w-full z-20 ${
                                                filteredClients.length > 10
                                                    ? "hidden"
                                                    : " absolute top-10 left-[-8px]"
                                            }`}
                                        >
                                            {filteredClients.length > 0 && (
                                                <div className="absolute bg-white w-full border border-dark/70 rounded-md mt-1">
                                                    {filteredClients.map(
                                                        (client) => (
                                                            <div
                                                                key={client._id}
                                                                className="p-2 border border-dark/70 w-full bg-light cursor-pointer"
                                                                onClick={() => {
                                                                    setClientId(
                                                                        client._id
                                                                    );
                                                                    setSearch(
                                                                        client.name
                                                                    );
                                                                    setFilteredClients(
                                                                        []
                                                                    );
                                                                }}
                                                            >
                                                                {client.name}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-dark">Weight</p>
                                    <input
                                        id="weight"
                                        name="weight"
                                        type="text"
                                        autoComplete="weight"
                                        placeholder="Example: 1 kg"
                                        required
                                        value={weight}
                                        onChange={(e) =>
                                            setWeight(e.target.value)
                                        }
                                        className="rounded-md p-2 border w-full"
                                    />
                                </div>

                                <div>
                                    <p className="text-dark">Species</p>
                                    <input
                                        id="species"
                                        name="species"
                                        type="text"
                                        placeholder="Example: Dog"
                                        required
                                        value={species}
                                        onChange={(e) =>
                                            setSpecies(e.target.value)
                                        }
                                        className="rounded-md p-2 border w-full"
                                    />
                                </div>

                                <div>
                                    <p className="text-dark">Breed</p>
                                    <input
                                        id="breed"
                                        name="breed"
                                        type="text"
                                        autoComplete="breed"
                                        placeholder="Example: Poodle"
                                        required
                                        value={breed}
                                        onChange={(e) =>
                                            setBreed(e.target.value)
                                        }
                                        className="rounded-md p-2 border w-full"
                                    />
                                </div>

                                <div>
                                    <p className="text-dark">Birthdate</p>
                                    <input
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        value={birthdate}
                                        onChange={(e) =>
                                            setBirthdate(e.target.value)
                                        }
                                        className="rounded-md p-2 border w-full"
                                    />
                                </div>

                                <div>
                                    <p className="text-dark">Age</p>
                                    <input
                                        id="age"
                                        name="age"
                                        type="text"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="rounded-md p-2 border w-full"
                                    />
                                </div>

                                <div>
                                    <p className="text-dark">Color</p>
                                    <input
                                        id="color"
                                        name="color"
                                        type="text"
                                        required
                                        value={color}
                                        placeholder="Example: White"
                                        onChange={(e) =>
                                            setColor(e.target.value)
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
                                {buttonLoading ? (
                                    <PulseLoaderComponent
                                        size={15}
                                        color="#FFFBF5"
                                    />
                                ) : (
                                    "Create New Pet"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddNewPet;
