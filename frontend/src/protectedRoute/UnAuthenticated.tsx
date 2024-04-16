import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Navigate, Outlet } from "react-router-dom";
import { toggleStore } from "../stores/toggleStore";
import { adminStore } from "../stores/adminStore";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const UnAuthenticated = () => {
    const toggle = toggleStore((state) => state.toggle);
    const token = adminStore((state) => state.adminInfo.token);

    if (!token) {
        return <Navigate to="/auth/login" />;
    }

    return (
        <>
            <div className="flex">
                <div
                    className={`${
                        toggle
                            ? "z-10 absolute top-0 left-0"
                            : "hidden lg:block"
                    } w-[300px] h-screen overflow-auto`}
                >
                    <SideBar />
                </div>
                <div className="w-full h-screen overflow-auto">
                    <NavBar />
                    <Outlet />
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    );
};

export default UnAuthenticated;
