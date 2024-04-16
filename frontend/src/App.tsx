import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UnAuthenticated from "./protectedRoute/UnAuthenticated";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import Products from "./pages/Products";
import Admins from "./pages/Admins";
import Clients from "./pages/Clients";
import Pets from "./pages/Pets";
import Appointments from "./pages/Appointments";
import AppointmentHistory from "./pages/AppointmentHistory";
import ClientInfo from "./pages/ClientInfo";
import PetInfo from "./pages/PetInfo";
import Authenticated from "./protectedRoute/Authenticated";
import AddNewAdmin from "./pages/AddNewAdmin";
import ProductInfo from "./pages/ProductInfo";
import AddNewProduct from "./pages/AddNewProduct";
import AddNewClient from "./pages/AddNewClient";
import AddNewPet from "./pages/AddNewPet";
import AppointmentInfo from "./pages/AppointmentInfo";
import AppointmentHistoryInfo from "./pages/AppointmentHistoryInfo";
import Records from "./pages/Records";
import RecordsInfo from "./pages/RecordsInfo";
import Invoice from "./pages/Invoice";
import InvoiceInfo from "./pages/InvoiceInfo";
import AddNewInvoice from "./pages/AddNewInvoice";
import Sales from "./pages/Sales";
import AddNewRecord from "./pages/AddNewRecord";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Categories from "./pages/Categories";
import AddNewCategory from "./pages/AddNewCategory";
import BlockedClients from "./pages/BlockedClients";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UnAuthenticated />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/inventory/categories",
                element: <Categories />,
            },
            {
                path: "/inventory/add-new-category",
                element: <AddNewCategory />,
            },
            {
                path: "/inventory/products",
                element: <Products />,
            },
            {
                path: "/inventory/product/:id",
                element: <ProductInfo />,
            },
            {
                path: "/inventory/add-new-product",
                element: <AddNewProduct />,
            },
            {
                path: "/inventory/invoice",
                element: <Invoice />,
            },
            {
                path: "/inventory/invoice/:id",
                element: <InvoiceInfo />,
            },
            {
                path: "/inventory/add-new-invoice",
                element: <AddNewInvoice />,
            },
            {
                path: "/inventory/sales",
                element: <Sales />,
            },
            {
                path: "/appointments",
                element: <Appointments />,
            },
            {
                path: "/appointments/:id",
                element: <AppointmentInfo />,
            },
            {
                path: "/appointment-history",
                element: <AppointmentHistory />,
            },
            {
                path: "/appointment-history/:id",
                element: <AppointmentHistoryInfo />,
            },
            {
                path: "/admins",
                element: <Admins />,
            },
            {
                path: "/admins/add-new-admin",
                element: <AddNewAdmin />,
            },
            {
                path: "/clients",
                element: <Clients />,
            },
            {
                path: "/clients/:clientId",
                element: <ClientInfo />,
            },
            {
                path: "/client/add-new-client",
                element: <AddNewClient />,
            },
            {
                path: "/blocked-clients",
                element: <BlockedClients />,
            },
            {
                path: "/pets",
                element: <Pets />,
            },
            {
                path: "/pets/:petId",
                element: <PetInfo />,
            },
            {
                path: "/pet/add-new-pet",
                element: <AddNewPet />,
            },
            {
                path: "/records",
                element: <Records />,
            },
            {
                path: "/records/:id",
                element: <RecordsInfo />,
            },
            {
                path: "/record/add-new-record",
                element: <AddNewRecord />,
            },
        ],
    },
    {
        path: "/auth",
        element: <Authenticated />,
        children: [
            {
                path: "/auth/login",
                element: <Login />,
            },
            {
                path: "/auth/register",
                element: <Register />,
            },
            {
                path: "/auth/forgot-password",
                element: <ForgotPassword />,
            },
        ],
    },
    {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
    },
    {
        path: "/terms-conditions",
        element: <TermsConditions />,
    },
    {
        path: "*",
        element: <ErrorPage />,
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
