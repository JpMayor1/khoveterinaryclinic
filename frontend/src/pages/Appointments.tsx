import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppointmentType } from "../utils/Types";
import { formatAppointmentTime } from "../utils/formatAppointmentTime";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Appointments = () => {
    const [appointments, setAppointments] = useState<AppointmentType[]>(
        [] as AppointmentType[]
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPendingAppointments = async () => {
            setLoading(true);
            try {
                await axios
                    .get(`${url}/api/appointments`)
                    .then((res) => {
                        // Filter and display future appointments
                        const currentDate = new Date();
                        const futureAppointments = res.data.filter(
                            (appointment: AppointmentType) => {
                                const timeString =
                                    appointment.time.toLowerCase();
                                const isPM = timeString.includes("pm");
                                const [hours, minutes] = timeString
                                    .replace(/[^\d:]/g, "")
                                    .split(":");

                                let hours24 = parseInt(hours, 10);
                                if (isPM && hours24 !== 12) {
                                    hours24 += 12;
                                } else if (!isPM && hours24 === 12) {
                                    hours24 = 0;
                                }

                                const appointmentDateTime = new Date(
                                    appointment.date
                                );
                                appointmentDateTime.setHours(
                                    hours24,
                                    parseInt(minutes, 10),
                                    0,
                                    0
                                );

                                return appointmentDateTime >= currentDate;
                            }
                        );

                        setAppointments(futureAppointments);
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error(err.response.data.error);
                    });
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch pending appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchPendingAppointments();
    }, []);

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">
                Pending Appointments
            </h1>
            <div className="w-full flex flex-col items-center">
                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : appointments.length === 0 ? (
                    <h1 className="text-xl font-semibold">
                        No pending appointments.
                    </h1>
                ) : (
                    <div className="w-full px-2">
                        <table className="w-full border border-dark/50">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Date
                                    </th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Time
                                    </th>
                                    <th className="py-2 px-4">Client</th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Pet
                                    </th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Purpose
                                    </th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments
                                    .slice()
                                    .reverse()
                                    .map((appointment) => (
                                        <tr
                                            key={appointment._id}
                                            className="border border-dark/50"
                                        >
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {formatDate(appointment.date)}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {formatAppointmentTime(
                                                    appointment.time
                                                )}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {appointment.client.name}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {appointment.pet.name}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {appointment.purpose}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {appointment.status}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <Link
                                                    to={`/appointments/${appointment._id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
