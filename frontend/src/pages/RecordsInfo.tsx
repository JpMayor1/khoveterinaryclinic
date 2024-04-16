import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { RecordType } from "../utils/Types";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { MdAddBox, MdPrint } from "react-icons/md";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const RecordsInfo = () => {
    const [record, setRecord] = useState<RecordType>({} as RecordType);
    const [error, setError] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [date, setDate] = useState("");
    const [temp, setTemp] = useState("");
    const [weight, setWeight] = useState("");
    const [history, setHistory] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [treatment, setTreatment] = useState("");
    const [followUp, setFollowUp] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const id = location.pathname.split("/")[2];
    const navigate = useNavigate();

    useEffect(() => {
        const getRecordInfo = async () => {
            setPageLoading(true);
            try {
                const response = await axios.get(`${url}/api/records/${id}`);
                setRecord(response.data);
            } catch (error) {
                setError(true);
                console.error(error);
                toast.error("Failed to fetch record information");
            } finally {
                setPageLoading(false);
            }
        };
        getRecordInfo();
    }, [id]);

    if (pageLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <PulseLoaderComponent size={20} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-2xl font-semibold">Pet not found</h1>
            </div>
        );
    }

    const handleSubmit = async () => {
        setButtonLoading(true);
        try {
            if (
                !date ||
                !temp ||
                !weight ||
                !diagnosis ||
                !treatment ||
                !followUp
            ) {
                setButtonLoading(false);
                return toast.error("Fill out required fields");
            }
            const table = {
                date,
                temp,
                weight,
                history,
                diagnosis,
                treatment,
                followUp,
            };
            await axios
                .post(`${url}/api/records/table/${id}`, { table })
                .then((res) => {
                    toast.success(res.data.message);
                    setIsAdding(false);
                    setButtonLoading(false);
                    setDate("");
                    setTemp("");
                    setWeight("");
                    setHistory("");
                    setDiagnosis("");
                    setTreatment("");
                    setFollowUp("");
                    setRecord(res.data.record);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setButtonLoading(false);
                });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add record");
            setButtonLoading(false);
        }
    };

    const deleteRecord = async () => {
        setButtonLoading(true);
        setShowDeleteModal(false);
        try {
            await axios
                .delete(`${url}/api/records/delete/${id}`)
                .then((res) => {
                    toast.success(res.data);
                    setButtonLoading(false);
                    return setTimeout(() => {
                        navigate("/records");
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(err.response.data);
                    setButtonLoading(false);
                });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete record");
            setButtonLoading(false);
        }
    };

    // Function to handle opening the delete modal
    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    // Function to handle closing the delete modal
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="h-full w-full">
            <div className="w-full sm:flex items-center justify-start p-4 hidden">
                <button
                    className="flex flex-col items-center bg-dark text-light p-3 rounded-md text-2xl"
                    onClick={print}
                >
                    <MdPrint />
                </button>
            </div>
            <div className="h-full w-full flex items-start justify-center p-4 pb-10">
                <div className="max-w-[1200px] w-full print-record">
                    <header className="w-full flex items-center justify-evenly text-center">
                        <div className="hidden sm:block image-container">
                            <img
                                src="/logo.jpg"
                                alt="logo"
                                className="h-28 w-28 rounded-full"
                            />
                        </div>
                        <div className="text-container">
                            <h1 className="text-2xl mb-4 font-bold">
                                KHO VETERINARY CLINIC
                            </h1>
                            <p>Daet Branch</p>
                            <p>
                                San Vicente Rd., Lag-og, Daet, Camarines Norte
                            </p>
                            <h2 className="text-lg mb-4 font-bold">
                                PATIENT'S CONSULTATION RECORD
                            </h2>
                        </div>
                        <div className="hidden sm:block image-container">
                            <img
                                src="/logo.jpg"
                                alt="logo"
                                className="h-28 w-28 rounded-full"
                            />
                        </div>
                    </header>
                    {/* Client Informations */}
                    <div className="w-full mt-3">
                        <h2 className="font-semibold text-lg">
                            Client Information
                        </h2>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-1 ml-2">
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full">
                                    <p className="text-dark text-lg">
                                        Client's Name: {record.client.name}
                                    </p>
                                </div>

                                <div className="w-full">
                                    <p className="text-dark text-lg">
                                        Contact Number:{" "}
                                        {formatPhoneNumber(
                                            record.client.contactNumber
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">
                                <div className="w-full">
                                    <p className="text-dark text-lg">
                                        Email: {record.client.email}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <p className="text-dark text-lg">
                                        Address: {record.client.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pet Informations */}
                    <div className="w-full mt-3">
                        <h2 className="font-semibold text-lg">
                            Pet Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-2">
                            <div className="flex flex-col">
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Pet's Name: {record.pet.name}
                                    </p>
                                </div>
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Birthdate:{" "}
                                        {formatDate(record.pet.birthdate)}
                                    </p>
                                </div>
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Age: {record.pet.age}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Species: {record.pet.species}
                                    </p>
                                </div>
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Gender: {record.pet.gender}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Breed: {record.pet.breed}
                                    </p>
                                </div>
                                <div className="flex justify-start items-center gap-1">
                                    <p className="text-dark text-lg">
                                        Color: {record.pet.color}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Record */}
                    {isAdding ? (
                        <div className="bg-white p-4 rounded-lg shadow-md m-2 disabled">
                            <form>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-dark">Date</p>
                                        <input
                                            id="date"
                                            name="date"
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-dark">
                                            Temperature (°C)
                                        </p>
                                        <input
                                            id="temp"
                                            name="temp"
                                            required
                                            type="text"
                                            value={temp}
                                            onChange={(e) =>
                                                setTemp(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-dark">Weight</p>
                                        <input
                                            id="weight"
                                            name="weight"
                                            type="text"
                                            value={weight}
                                            onChange={(e) =>
                                                setWeight(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-dark">History</p>
                                        <input
                                            id="history"
                                            name="history"
                                            type="text"
                                            value={history}
                                            onChange={(e) =>
                                                setHistory(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-dark">Diagnosis</p>
                                        <input
                                            id="diagnosis"
                                            name="diagnosis"
                                            type="text"
                                            value={diagnosis}
                                            onChange={(e) =>
                                                setDiagnosis(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-dark">Treatment</p>
                                        <input
                                            id="treatment"
                                            name="treatment"
                                            type="text"
                                            value={treatment}
                                            onChange={(e) =>
                                                setTreatment(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-dark">Follow Up</p>
                                        <input
                                            id="followUp"
                                            name="followUp"
                                            type="date"
                                            value={followUp}
                                            onChange={(e) =>
                                                setFollowUp(e.target.value)
                                            }
                                            className="rounded-md p-2 border w-full"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 space-x-4">
                                    <button
                                        className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                                        onClick={handleSubmit}
                                        disabled={buttonLoading}
                                    >
                                        {buttonLoading ? (
                                            <PulseLoaderComponent
                                                size={10}
                                                color="#FFFBF5"
                                            />
                                        ) : (
                                            "Save"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ml-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="h-full w-full sm:w-[1000px] overflow-auto p-2">
                                <table className="w-[1100px] border border-dark">
                                    <thead className="bg-primary text-light ">
                                        <tr>
                                            <th className="py-2 px-4">
                                                History
                                            </th>
                                            <th className="py-2 px-4">Date</th>
                                            <th className="py-2 px-4">Temp</th>
                                            <th className="py-2 px-4">
                                                Weight
                                            </th>

                                            <th className="py-2 px-4">
                                                Diagnosis
                                            </th>
                                            <th className="py-2 px-4">
                                                Treatment
                                            </th>
                                            <th className="py-2 px-4">
                                                Follow-Up
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {record.tables.map((table) => (
                                            <tr
                                                className="border border-dark"
                                                key={table.date}
                                            >
                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {table.history}
                                                </td>
                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {formatDate(table.date)}
                                                </td>
                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {table.temp}
                                                </td>
                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {table.weight}
                                                </td>

                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {table.diagnosis}
                                                </td>
                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {table.treatment}
                                                </td>

                                                <td className="py-2 px-4 text-center border border-dark/70">
                                                    {formatDate(table.followUp)}
                                                </td>
                                            </tr>
                                        ))}
                                        {record.tables.length === 0 && (
                                            <tr className="border border-dark">
                                                <td
                                                    colSpan={7}
                                                    className="py-2 px-4 text-center border border-dark/70"
                                                >
                                                    No Record Yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-center items-center disabled">
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="text-primary text-[44px] rounded-md focus:outline-none"
                                >
                                    <MdAddBox />
                                </button>
                                <button
                                    className="bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md"
                                    onClick={handleOpenDeleteModal}
                                >
                                    {buttonLoading ? (
                                        <PulseLoaderComponent
                                            size={7}
                                            color="#FFFBF5"
                                        />
                                    ) : (
                                        <AiOutlineDelete />
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                    {showDeleteModal && (
                        <ConfirmationModal
                            isOpen={showDeleteModal}
                            message="Are you sure you want to delete this Record?"
                            onConfirm={deleteRecord}
                            onCancel={handleCloseDeleteModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordsInfo;
