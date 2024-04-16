import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { ProductType } from "../utils/Types";
import { CiSquareMinus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdOutlineAddBox } from "react-icons/md";
import { invoiceProductStore } from "../stores/invoiceProductStore";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import formatInvoicePrice from "../utils/formatInvoicePrice";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AddNewInvoice = () => {
    const [date, setDate] = useState("");
    const [client, setClient] = useState("");
    const [pet, setPet] = useState("");
    const [service, setService] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [total, setTotal] = useState(0);
    const [servicesArray, setServicesArray] = useState<
        { name: string; price: number }[]
    >([]);

    const selectedProducts = invoiceProductStore(
        (state) => state.selectedProducts
    );
    const addProduct = invoiceProductStore((state) => state.addProduct);
    const removeProduct = invoiceProductStore((state) => state.removeProduct);
    const removeAllProducts = invoiceProductStore(
        (state) => state.removeAllProducts
    );
    const increaseQuantity = invoiceProductStore(
        (state) => state.increaseQuantity
    );
    const decreaseQuantity = invoiceProductStore(
        (state) => state.decreaseQuantity
    );

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axios.get(`${url}/api/products`);
                setProducts(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getProducts();
    }, []);

    useEffect(() => {
        // Recalculate total whenever services or products change
        const servicesTotal = servicesArray.reduce(
            (sum, service) => sum + service.price,
            0
        );
        const productsTotal = selectedProducts.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0
        );
        setTotal(servicesTotal + productsTotal);
    }, [servicesArray, selectedProducts]);

    const addService = () => {
        if (service.trim() !== "" && servicePrice.trim() !== "") {
            setServicesArray([
                ...servicesArray,
                { name: service, price: parseFloat(servicePrice) },
            ]);
            setService("");
            setServicePrice("");
        }
    };

    const removeService = (index: number) => {
        const updatedServices = [...servicesArray];
        updatedServices.splice(index, 1);
        setServicesArray(updatedServices);
    };

    const searchProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setSearch(newQuery);
        const filtered = products.filter((item) =>
            item.name.toLowerCase().includes(newQuery.toLowerCase())
        );
        if (newQuery === "") {
            setFilteredProducts([]);
        } else {
            setFilteredProducts(filtered);
        }
    };

    const addProductFunc = (
        _id: string,
        name: string,
        price: number,
        stock: number
    ) => {
        const product = {
            _id,
            name,
            price,
            quantity: 1,
            stock: stock,
        };
        addProduct(product);
        setSearch("");
        setFilteredProducts([]);
    };

    const createInvoiceRecord = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios
                .post(`${url}/api/invoice/create`, {
                    date,
                    client,
                    pet,
                    services: servicesArray,
                    products: selectedProducts,
                    total,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    removeAllProducts();
                    setServicesArray([]);
                    setLoading(false);
                    setTimeout(() => {
                        navigate("/inventory/invoice");
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setLoading(false);
                });
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong! Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg m-2">
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-dark">
                Add New Invoice
            </h2>
            <form onSubmit={createInvoiceRecord}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-dark">Date</p>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Client</p>
                        <input
                            id="client"
                            name="client"
                            type="text"
                            required
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Pet</p>
                        <input
                            id="pet"
                            name="pet"
                            type="text"
                            required
                            value={pet}
                            onChange={(e) => setPet(e.target.value)}
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Total</p>
                        <input
                            id="total"
                            name="total"
                            type="number"
                            required
                            value={total}
                            disabled
                            className="rounded-md p-2 border w-full"
                        />
                    </div>
                    <div>
                        <p className="text-dark">Services</p>
                        <div className="flex items-center space-x-2">
                            <input
                                id="service"
                                name="service"
                                type="text"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                className="rounded-md p-2 border w-full"
                                placeholder="Service Name"
                            />
                            <input
                                id="servicePrice"
                                name="servicePrice"
                                type="number"
                                value={servicePrice}
                                onChange={(e) =>
                                    setServicePrice(e.target.value)
                                }
                                className="rounded-md p-2 border w-full"
                                placeholder="Service Price"
                            />
                            <button
                                type="button"
                                className="bg-primary hover:bg-primary/90 text-light text-2xl px-2 py-2 rounded-md"
                                onClick={addService}
                            >
                                <MdOutlineAddBox />
                            </button>
                        </div>
                        <div className="mt-2 space-y-2">
                            {servicesArray.map((s, index) => (
                                <div
                                    key={index}
                                    className="w-full flex items-center rounded-md"
                                >
                                    <span className="w-full font-semibold border border-dark/60 px-2 py-3 rounded-md">{`${
                                        s.name
                                    } ${formatInvoicePrice(s.price)}`}</span>
                                    <button
                                        type="button"
                                        className="text-red ml-2"
                                        onClick={() => removeService(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-dark">Products</p>
                        <div className="flex items-center space-x-2 relative">
                            <input
                                id="product"
                                name="product"
                                type="text"
                                value={search}
                                onChange={searchProduct}
                                className="rounded-md p-2 border w-full"
                                placeholder="Search Product Name"
                            />

                            <div
                                className={`w-full z-20 ${
                                    filteredProducts.length > 10
                                        ? "hidden"
                                        : " absolute top-10 left-[-8px]"
                                }`}
                            >
                                {filteredProducts.map((product) => (
                                    <p
                                        key={product._id}
                                        className="p-2 border border-dark w-full bg-light cursor-pointer"
                                        onClick={() =>
                                            addProductFunc(
                                                product._id,
                                                product.name,
                                                product.price,
                                                product.stock
                                            )
                                        }
                                    >
                                        {product.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 space-y-2">
                            {selectedProducts.map((p) => (
                                <div
                                    key={p._id}
                                    className="w-full flex items-center rounded-md"
                                >
                                    <div className="w-full flex items-center justify-between font-semibold border border-dark/60 px-2 py-3 rounded-md">
                                        <span>
                                            {`${p.name} - ${formatInvoicePrice(
                                                p.price
                                            )}`}{" "}
                                        </span>
                                        <div className="flex items-center gap-1 text-xl">
                                            <div
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    increaseQuantity(p._id)
                                                }
                                            >
                                                <MdAddBox />
                                            </div>
                                            {p.quantity}
                                            <div
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    decreaseQuantity(p._id)
                                                }
                                            >
                                                <CiSquareMinus />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="text-red ml-2"
                                        onClick={() => removeProduct(p._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-x-4">
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                    >
                        {loading ? (
                            <PulseLoaderComponent size={15} color="#FFFBF5" />
                        ) : (
                            "Create New Invoice"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewInvoice;
