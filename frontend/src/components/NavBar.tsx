import { useState } from "react";
import { BiBell } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { toggleStore } from "../stores/toggleStore";
import { productNotifStore } from "../stores/productNotifStore";
import { appointmentNotifStore } from "../stores/appointmentNotifStore";
import AppointmentNotification from "./AppointmentNotification";
import StockNotification from "./StockNotification";

const NavBar = () => {
    const [showNotification, setShowNotification] = useState(false);

    const appointments = appointmentNotifStore((state) => state.appointments);
    const products = productNotifStore((state) => state.products);
    const setToggle = toggleStore((state) => state.setToggle);

    const showNotificationFunc = () => {
        setShowNotification(!showNotification);
    };

    return (
        <div className="w-full h-16 bg-light2 text-4xl flex justify-between lg:justify-end items-center p-5">
            <button onClick={() => setToggle(true)} className="block lg:hidden">
                <GiHamburgerMenu />
            </button>

            <button className="relative" onClick={showNotificationFunc}>
                <BiBell />
                <div className="absolute top-[-10px] right-[-5px] text-sm text-light bg-red h-fit w-fit p-1 rounded-full">
                    {appointments + products.length}
                </div>

                {showNotification && (
                    <div className="absolute top-[35px] right-4 p-2 bg-light-green shadow-sm rounded-md rounded-tr-none text-lg w-[300px] h-fit flex flex-col justify-start items-start text-light">
                        <AppointmentNotification />
                        <StockNotification />
                    </div>
                )}
            </button>
        </div>
    );
};

export default NavBar;
