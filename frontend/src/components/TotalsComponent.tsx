import { BsBox } from "react-icons/bs";
import { MdPets } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { ClientType, PetType, ProductType } from "../utils/Types";
import PulseLoaderComponent from "../components/PulseLoaderComponent";

const TotalsComponent = ({
    clients,
    pets,
    products,
    loading,
}: {
    clients: ClientType[];
    pets: PetType[];
    products: ProductType[];
    loading: boolean;
}) => {
    return (
        <div className="max-w-[2000px] w-full flex flex-wrap gap-1 p-2 justify-evenly flex-col md:flex-row">
            {/* // Total Users */}
            <div className="bg-dark-blue min-w-[270px] h-[110px] rounded-md text-light flex justify-center items-center">
                {loading ? (
                    <PulseLoaderComponent size={10} color={"#FFFBF5"} />
                ) : (
                    <div className="flex">
                        <div className="text-8xl flex justify-center items-center">
                            <AiOutlineUser />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                            <h2 className="text-lg">Total Clients</h2>
                            <p className="text-2xl">{clients.length}</p>
                        </div>
                    </div>
                )}
            </div>
            {/* // Total Pets */}
            <div className="bg-dark-blue min-w-[270px] h-[110px] rounded-md text-light flex justify-center items-center">
                {loading ? (
                    <PulseLoaderComponent size={10} color={"#FFFBF5"} />
                ) : (
                    <div className="flex">
                        <div className="text-8xl flex justify-center items-center">
                            <MdPets />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                            <h2 className="text-lg">Total Pets</h2>
                            <p className="text-2xl">{pets.length}</p>
                        </div>
                    </div>
                )}
            </div>
            {/* // Total Products */}
            <div className="bg-dark-blue min-w-[270px] h-[110px] rounded-md text-light flex justify-center items-center">
                {loading ? (
                    <PulseLoaderComponent size={10} color={"#FFFBF5"} />
                ) : (
                    <div className="flex gap-1">
                        <div className="text-8xl flex justify-center items-center">
                            <BsBox />
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                            <h2 className="text-lg">Total Products</h2>
                            <p className="text-2xl">{products.length}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TotalsComponent;
