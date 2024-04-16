export type AdminType = {
    _id: string;
    username: string;
    email: string;
    contactNumber: string;
    superAdmin: boolean;
    token: string;
};

export type AdminStoreType = {
    adminInfo: AdminType;
    addAdminInfo: (info: AdminType) => void;
    adminLogout: () => void;
};

export type ToggleType = {
    toggle: boolean;
    setToggle: (toggle: boolean) => void;
};

export type CategoryStoreType = {
    categories: CategoryType[];
    setCategories: (categories: CategoryType[]) => void;
    addCategory: (category: CategoryType) => void;
    deleteCategory: (id: string) => void;
};

export type CategoryType = {
    _id: string;
    name: string;
};

export type ProductType = {
    _id: string;
    category: string;
    name: string;
    price: number;
    stock: number;
    sold: number;
};

export type PetType = {
    _id: string;
    clientId: ClientType;
    image: string;
    name: string;
    weight: string;
    breed: string;
    species: string;
    gender: string;
    age: string;
    birthdate: string;
    color: string;
    recordId: string;
};

export type ClientType = {
    _id: string;
    image: string;
    name: string;
    email: string;
    location: string;
    cpNumber: string;
    pets: PetType[];
    balance: number;
    blocked: boolean;
};

export type AppointmentType = {
    _id: string;
    client: ClientType;
    date: string;
    time: string;
    pet: PetType;
    purpose: string;
    status: string;
};

export type AppointmentStoreType = {
    appointments: AppointmentType[];
    addAppointment: (appointment: AppointmentType) => void;
};

export type TableType = {
    date: string;
    temp: string;
    weight: string;
    history: string;
    diagnosis: string;
    treatment: string;
    followUp: string;
};

export type RecordType = {
    _id: string;
    client: {
        name: string;
        email: string;
        contactNumber: string;
        address: string;
    };
    pet: {
        id: string;
        name: string;
        species: string;
        breed: string;
        birthdate: string;
        gender: string;
        color: string;
        age: string;
    };
    tables: TableType[];
};

export type ServiceType = {
    name: string;
    price: number;
};

export type InvoiceProductType = {
    name: string;
    price: number;
    quantity: number;
};

export type InvoiceType = {
    _id: string;
    date: string;
    client: string;
    pet: string;
    services: ServiceType[];
    products: InvoiceProductType[];
    total: number;
};

export type DailySalesType = {
    _id: string;
    date: string;
    dailySales: number;
};

export type InvoiceProductStateType = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
};

export type InvoiceProductStoreType = {
    selectedProducts: InvoiceProductStateType[];
    addProduct: (product: InvoiceProductStateType) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    removeProduct: (id: string) => void;
    removeAllProducts: () => void;
};

export type appointmentNotifStoreType = {
    appointments: number;
    setAppointments: (appointments: number) => void;
};

export type productNotifStoreType = {
    products: ProductType[];
    setProductState: (products: ProductType[]) => void;
};
