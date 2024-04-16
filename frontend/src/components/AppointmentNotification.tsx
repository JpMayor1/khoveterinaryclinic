import { Link } from "react-router-dom";
import { appointmentNotifStore } from "../stores/appointmentNotifStore";

const AppointmentNotification = () => {
    const appointments = appointmentNotifStore((state) => state.appointments);

    return (
        <>
            {appointments > 0 && (
                <div className="w-full flex items-center justify-between">
                    <p className="text-sm">
                        You have {appointments}{" "}
                        {appointments === 1 ? "appointment" : "appointments"}
                    </p>
                    <Link
                        to="/appointments"
                        className="underline text-base text-light2 hover:text-light"
                    >
                        View
                    </Link>
                </div>
            )}
        </>
    );
};

export default AppointmentNotification;
