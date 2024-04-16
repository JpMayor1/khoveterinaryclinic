import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { AppointmentType } from "../utils/Types";
import { useLocation, useNavigate } from "react-router-dom";
import { formatAppointmentTime } from "../utils/formatAppointmentTime";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AppointmentHistoryInfo = () => {
    const [appointment, setAppointment] = useState<AppointmentType>(
        {} as AppointmentType
    );
    const [error, setError] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const navigate = useNavigate();

    useEffect(() => {
        const getAppointmentInfo = async () => {
            setPageLoading(true);
            try {
                const response = await axios.get(
                    `${url}/api/appointments/${id}`
                );
                setAppointment(response.data);
            } catch (error) {
                setError(true);
                console.error(error);
                toast.error("Failed to fetch appointment information");
            } finally {
                setPageLoading(false);
            }
        };

        getAppointmentInfo();
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
                <h1 className="text-2xl font-semibold">
                    Appointment not found
                </h1>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-2xl font-semibold">
                    Appointment not found
                </h1>
            </div>
        );
    }

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeMDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const deleteAppointment = async () => {
        setButtonLoading(true);
        setShowDeleteModal(false);
        try {
            await axios
                .delete(`${url}/api/appointments/delete/${id}`)
                .then((res) => {
                    toast.success(res.data.message);
                    setButtonLoading(false);
                    return setTimeout(() => {
                        navigate("/appointment-history");
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setButtonLoading(false);
                    return;
                });
        } catch (error) {
            console.log(error);
            setButtonLoading(false);
            return;
        }
    };

    return (
        <div className="h-full w-full p-4">
            <h1 className="text-2xl font-semibold mb-4">
                Appointment History Information
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print-appointment">
                <div>
                    <p className="text-dark text-lg font-bold">Date</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {formatDate(appointment.date)}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Time</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {formatAppointmentTime(appointment.time)}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Client</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.client.name}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">
                        Contact Number
                    </p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {formatPhoneNumber(appointment.client.cpNumber)}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Pet</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.pet.name}
                    </p>
                </div>

                <div>
                    <p className="text-dark text-lg font-bold">Species</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.pet.species}
                    </p>
                </div>

                <div>
                    <p className="text-dark text-lg font-bold">Breed</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.pet.breed}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Weight</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.pet.weight}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Age</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.pet.age}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Gender</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.pet.gender}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Status</p>

                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.status}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Purpose</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.purpose}
                    </p>
                </div>
            </div>
            <div className="py-2">
                <button
                    className={`bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ml-2 border ${
                        buttonLoading
                            ? "cursor-not-allowed text-sm"
                            : "text-2xl"
                    }`}
                    onClick={openDeleteModal}
                >
                    {buttonLoading ? (
                        <PulseLoaderComponent size={8} color="#FFFBF5" />
                    ) : (
                        <AiOutlineDelete />
                    )}
                </button>
            </div>
            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    message="Are you sure you want to delete this Product?"
                    onConfirm={deleteAppointment}
                    onCancel={closeMDeleteModal}
                />
            )}
        </div>
    );
};

export default AppointmentHistoryInfo;
