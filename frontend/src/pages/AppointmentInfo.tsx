import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AppointmentType } from "../utils/Types";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { formatAppointmentTime } from "../utils/formatAppointmentTime";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AppointmentInfo = () => {
    const [appointment, setAppointment] = useState<AppointmentType>(
        {} as AppointmentType
    );
    const [error, setError] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const id = location.pathname.split("/")[2];

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

    const updateAppointment = async () => {
        setButtonLoading(true);
        const updatedAppointment = {
            status: newStatus ? newStatus : appointment.status,
        };
        try {
            await axios
                .put(`${url}/api/appointments/update/${id}`, updatedAppointment)
                .then((res) => {
                    toast.success("Appointment updated successfully");
                    setIsEditing(false);
                    setButtonLoading(false);
                    setAppointment(res.data);
                    setTimeout(() => {
                        navigate("/appointments");
                    }, 3001);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setButtonLoading(false);
                });
        } catch (error) {
            console.log(error);
            setButtonLoading(false);
        }
    };

    return (
        <div className="h-full w-full p-4">
            <h1 className="text-2xl font-semibold mb-4">
                Appointment Information
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {isEditing ? (
                        <>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                            >
                                <option value="">Select Status</option>
                                <option value="PENDING">PENDING</option>
                                <option value="ACCEPTED">ACCEPTED</option>
                                <option value="DECLINED">DECLINED</option>
                            </select>
                        </>
                    ) : (
                        <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                            {appointment.status}
                        </p>
                    )}
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Purpose</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {appointment.purpose}
                    </p>
                </div>
            </div>
            <div className="py-4 space-x-4">
                {isEditing ? (
                    <>
                        <button
                            className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                            onClick={() => updateAppointment()}
                        >
                            {buttonLoading ? (
                                <PulseLoaderComponent
                                    size={10}
                                    color="#FFFBF5"
                                />
                            ) : (
                                "Update"
                            )}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-red hover.bg-red/90 text-light px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="bg-primary hover.bg-primary/90 text-light px-4 py-2 rounded-md"
                            onClick={() => setIsEditing(true)}
                        >
                            Update Status
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AppointmentInfo;
