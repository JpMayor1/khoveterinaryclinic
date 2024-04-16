import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { adminStore } from "../stores/adminStore";
import { Navigate, Outlet } from "react-router-dom";

const Authenticated = () => {
    const token = adminStore((state) => state.adminInfo.token);

    if (token) {
        return <Navigate to="/" />;
    }
    
    return (
        <>
            <div className="w-full h-screen overflow-auto">
                <Outlet />
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

export default Authenticated;
