import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { productNotifStoreType } from "../utils/Types";

export const productNotifStore = create<productNotifStoreType>()(
    devtools(
        persist(
            (set) => ({
                products: [],
                setProductState: (products) => set(() => ({ products })),
            }),
            {
                name: "productNotif-storage",
            }
        )
    )
);
