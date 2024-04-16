import {
    AppointmentType,
    ClientType,
    DailySalesType,
    PetType,
    ProductType,
} from "../utils/Types";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { categoryStore } from "../stores/categoryStore";
import { productNotifStore } from "../stores/productNotifStore";
import { appointmentNotifStore } from "../stores/appointmentNotifStore";
import DailySalesComponent from "../components/DailySalesComponent";
import TotalsComponent from "../components/TotalsComponent";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Dashboard = () => {
    const [clients, setClients] = useState<ClientType[]>([]);
    const [pets, setPets] = useState<PetType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [dailySales, setDailySales] = useState<DailySalesType[]>([]);
    const [loading, setLoading] = useState(false);

    const setCategories = categoryStore((state) => state.setCategories);
    const setAppointments = appointmentNotifStore(
        (state) => state.setAppointments
    );
    const setProductState = productNotifStore((state) => state.setProductState);

    useEffect(() => {
        const categories = async () => {
            setLoading(true);
            try {
                await axios.get(`${url}/api/categories`).then((res) => {
                    setCategories(res.data);
                });

                await axios.get(`${url}/api/clients`).then((res) => {
                    setClients(res.data);
                    return;
                });

                await axios.get(`${url}/api/pets`).then((res) => {
                    setPets(res.data);
                    return;
                });

                await axios.get(`${url}/api/products`).then((res) => {
                    setProducts(res.data);
                    const filteredProducts = res.data.filter(
                        (product: ProductType) => product.stock < 11
                    );
                    setProductState(filteredProducts);
                });

                await axios.get(`${url}/api/sales`).then((res) => {
                    const formattedData = res.data.map(
                        (sale: DailySalesType) => ({
                            ...sale,
                            date: formatDate(sale.date),
                        })
                    );
                    setDailySales(formattedData);
                });

                await axios.get(`${url}/api/appointments`).then((res) => {
                    // Filter and display future appointments
                    const currentDate = new Date();
                    const futureAppointments = res.data.filter(
                        (appointment: AppointmentType) => {
                            const timeString = appointment.time.toLowerCase();
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

                    setAppointments(futureAppointments.length);
                });
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        categories();
    }, [setCategories, setAppointments, setProductState]);

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Dashboard</h1>
            <div className="w-full">
                <TotalsComponent
                    clients={clients}
                    pets={pets}
                    products={products}
                    loading={loading}
                />
            </div>
            <div className="w-full mt-2 p-2">
                <DailySalesComponent
                    dailySales={dailySales}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Dashboard;
