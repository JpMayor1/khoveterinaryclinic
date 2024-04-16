import {
    AiOutlineUser,
    AiOutlineSchedule,
    AiOutlineClose,
} from "react-icons/ai";
import {
    FaArrowCircleDown,
    FaArrowCircleRight,
    FaFileInvoice,
} from "react-icons/fa";
import {
    MdPets,
    MdOutlineInventory,
    MdAddBox,
    MdDashboard,
    MdOutlineAttachMoney,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { ImBlocked } from "react-icons/im";
import { CiViewList } from "react-icons/ci";
import { useEffect, useState } from "react";
import { RiAdminLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import { adminStore } from "../stores/adminStore";
import { toggleStore } from "../stores/toggleStore";
import { BiTask, BiCategoryAlt } from "react-icons/bi";

const SideBar = () => {
    const [showInventoryLinks, setShowInventoryLinks] = useState(false);
    const [showClientLinks, setShowClientLinks] = useState(false);
    const [showAdminLinks, setShowAdminLinks] = useState(false);
    const [showPetLinks, setShowPetLinks] = useState(false);
    const [showAppointmentLinks, setShowAppointmentLinks] = useState(false);
    const [showRecordLinks, setShowRecordLinks] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith("/inventory")) {
            setShowInventoryLinks(true);
        } else if (location.pathname.startsWith("/client")) {
            setShowClientLinks(true);
        } else if (location.pathname.startsWith("/admins")) {
            setShowAdminLinks(true);
        } else if (location.pathname.startsWith("/pet")) {
            setShowPetLinks(true);
        } else if (location.pathname.startsWith("/appointment")) {
            setShowAppointmentLinks(true);
        } else if (location.pathname.startsWith("/records")) {
            setShowRecordLinks(true);
        }
    }, [location]);

    const adminLogout = adminStore((state) => state.adminLogout);
    const setToggle = toggleStore((state) => state.setToggle);
    const toggle = toggleStore((state) => state.toggle);

    return (
        <div className="hide-scrollbar min-h-screen h-full overflow-y-auto bg-primary text-light flex flex-col justify-start">
            <div>
                <div className="w-full p-3 flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center justify-center">
                        <img
                            src="/logo.jpg"
                            alt="logo"
                            className="h-12 w-12 rounded-full"
                        />
                        <h1 className="font-bold text-light">
                            Kho Veterinary Clinic
                        </h1>
                    </div>
                    {toggle && (
                        <button
                            onClick={() => setToggle(false)}
                            className="text-lg ease-in-out duration-300 lg:hidden"
                        >
                            <AiOutlineClose />
                        </button>
                    )}
                </div>
                {/* Dashboard */}
                <Link
                    to="/"
                    className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                        location.pathname === "/" && "bg-dark"
                    }`}
                >
                    <MdDashboard />
                    Dashboard
                </Link>

                {/* inventory */}
                <button
                    onClick={() => setShowInventoryLinks(!showInventoryLinks)}
                    className={`w-full flex items-center start-center gap-2 p-2 pl-5 mt-1 hover:bg-dark/80 cursor-pointer ${
                        location.pathname.startsWith("/inventory") &&
                        "bg-dark/50"
                    }
                        }`}
                >
                    {showInventoryLinks ? (
                        <FaArrowCircleDown />
                    ) : (
                        <FaArrowCircleRight />
                    )}
                    Inventory
                </button>
                {showInventoryLinks && (
                    <div
                        className={`pl-5 pb-1 mb-1 ${
                            location.pathname.startsWith("/inventory") &&
                            "bg-dark/50"
                        }`}
                    >
                        <Link
                            to="/inventory/categories"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith(
                                    "/inventory/categories"
                                ) && "bg-dark"
                            }`}
                        >
                            <BiCategoryAlt />
                            Product Categories
                        </Link>
                        <Link
                            to="/inventory/add-new-category"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname ===
                                    "/inventory/add-new-category" && "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add Category
                        </Link>
                        <Link
                            to="/inventory/products"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith(
                                    "/inventory/product"
                                ) && "bg-dark"
                            }`}
                        >
                            <MdOutlineInventory />
                            Products
                        </Link>
                        <Link
                            to="/inventory/add-new-product"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname ===
                                    "/inventory/add-new-product" && "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add Product
                        </Link>
                        <Link
                            to="/inventory/invoice"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith(
                                    "/inventory/invoice"
                                ) && "bg-dark"
                            }`}
                        >
                            <FaFileInvoice />
                            Invoice
                        </Link>
                        <Link
                            to="/inventory/add-new-invoice"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname ===
                                    "/inventory/add-new-invoice" && "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add Invoice
                        </Link>
                        <Link
                            to="/inventory/sales"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith(
                                    "/inventory/sales"
                                ) && "bg-dark"
                            }`}
                        >
                            <MdOutlineAttachMoney /> Sales
                        </Link>
                    </div>
                )}

                {/* appointments */}
                <button
                    onClick={() =>
                        setShowAppointmentLinks(!showAppointmentLinks)
                    }
                    className={`w-full flex items-center start-center gap-2 p-2 pl-5 mt-1 hover:bg-dark/80 cursor-pointer ${
                        location.pathname.startsWith("/appointment") &&
                        "bg-dark/50"
                    }
                        }`}
                >
                    {showAppointmentLinks ? (
                        <FaArrowCircleDown />
                    ) : (
                        <FaArrowCircleRight />
                    )}
                    Appointment
                </button>
                {showAppointmentLinks && (
                    <div
                        className={`pl-5 pb-1 mb-1 ${
                            location.pathname.startsWith("/appointment") &&
                            "bg-dark/50"
                        }`}
                    >
                        <Link
                            to="/appointments"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith("/appointments") &&
                                "bg-dark"
                            }`}
                        >
                            <AiOutlineSchedule />
                            Pending Appointments
                        </Link>

                        {/* appointment history */}
                        <Link
                            to="/appointment-history"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith(
                                    "/appointment-history"
                                ) && "bg-dark"
                            }`}
                        >
                            <BiTask />
                            Appointment History
                        </Link>
                    </div>
                )}

                {/* admins */}
                <button
                    onClick={() => setShowAdminLinks(!showAdminLinks)}
                    className={`w-full flex items-center start-center gap-2 p-2 pl-5 mt-1 hover:bg-dark/80 cursor-pointer ${
                        location.pathname.startsWith("/admins") && "bg-dark/50"
                    }
                        }`}
                >
                    {showAdminLinks ? (
                        <FaArrowCircleDown />
                    ) : (
                        <FaArrowCircleRight />
                    )}
                    Admin
                </button>
                {showAdminLinks && (
                    <div
                        className={`pl-5 pb-1 mb-1 ${
                            location.pathname.startsWith("/admins") &&
                            "bg-dark/50"
                        }`}
                    >
                        <Link
                            to="/admins"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname === "/admins" && "bg-dark"
                            }`}
                        >
                            <RiAdminLine />
                            All Admin
                        </Link>
                        <Link
                            to="/admins/add-new-admin"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname === "/admins/add-new-admin" &&
                                "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add New Admin
                        </Link>
                    </div>
                )}

                {/* clients */}
                <button
                    onClick={() => setShowClientLinks(!showClientLinks)}
                    className={`w-full flex items-center start-center gap-2 p-2 pl-5 mt-1 hover:bg-dark/80 cursor-pointer ${
                        location.pathname.startsWith("/client") && "bg-dark/50"
                    }
                        }`}
                >
                    {showClientLinks ? (
                        <FaArrowCircleDown />
                    ) : (
                        <FaArrowCircleRight />
                    )}
                    Clients
                </button>
                {showClientLinks && (
                    <div
                        className={`pl-5 pb-1 mb-1 ${
                            location.pathname.startsWith("/client") &&
                            "bg-dark/50"
                        }`}
                    >
                        <Link
                            to="/clients"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith("/clients") &&
                                "bg-dark"
                            }`}
                        >
                            <AiOutlineUser />
                            All Clients
                        </Link>
                        <Link
                            to="/client/add-new-client"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname ===
                                    "/client/add-new-client" && "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add New Client
                        </Link>
                        <Link
                            to="/blocked-clients"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith("/blocked") &&
                                "bg-dark"
                            }`}
                        >
                            <ImBlocked />
                            Blocked Clients
                        </Link>
                    </div>
                )}

                {/* pets */}
                <button
                    onClick={() => setShowPetLinks(!showPetLinks)}
                    className={`w-full flex items-center start-center gap-2 p-2 pl-5 mt-1 hover:bg-dark/80 cursor-pointer ${
                        location.pathname.startsWith("/pet") && "bg-dark/50"
                    }
                        }`}
                >
                    {showPetLinks ? (
                        <FaArrowCircleDown />
                    ) : (
                        <FaArrowCircleRight />
                    )}
                    Pets
                </button>
                {showPetLinks && (
                    <div
                        className={`pl-5 pb-1 mb-1 ${
                            location.pathname.startsWith("/pet") && "bg-dark/50"
                        }`}
                    >
                        <Link
                            to="/pets"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith("/pets") &&
                                "bg-dark"
                            }`}
                        >
                            <MdPets />
                            All Pets
                        </Link>
                        <Link
                            to="/pet/add-new-pet"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname === "/pet/add-new-pet" &&
                                "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add New Pet
                        </Link>
                    </div>
                )}

                {/* records */}
                <button
                    onClick={() => setShowRecordLinks(!showRecordLinks)}
                    className={`w-full flex items-center start-center gap-2 p-2 pl-5 mt-1 hover:bg-dark/80 cursor-pointer ${
                        location.pathname.startsWith("/record") && "bg-dark/50"
                    }
                        }`}
                >
                    {showRecordLinks ? (
                        <FaArrowCircleDown />
                    ) : (
                        <FaArrowCircleRight />
                    )}
                    Records
                </button>
                {showRecordLinks && (
                    <div
                        className={`pl-5 pb-1 mb-1 ${
                            location.pathname.startsWith("/record") &&
                            "bg-dark/50"
                        }`}
                    >
                        <Link
                            to="/records"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname.startsWith("/records") &&
                                "bg-dark"
                            }`}
                        >
                            <CiViewList />
                            All Records
                        </Link>
                        <Link
                            to="/record/add-new-record"
                            className={`flex items-center start-center gap-2 p-2 pl-5 hover:bg-dark/80 cursor-pointer ${
                                location.pathname ===
                                    "/record/add-new-record" && "bg-dark"
                            }`}
                        >
                            <MdAddBox />
                            Add New Record
                        </Link>
                    </div>
                )}
            </div>
            <button
                className="w-full p-3 mt-10 text-center bg-red mb-5 hover:bg-red/80"
                onClick={adminLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default SideBar;
