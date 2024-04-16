import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AdminStoreType } from "../utils/Types";

export const adminStore = create<AdminStoreType>()(
    devtools(
        persist(
            (set) => ({
                adminInfo: {
                    _id: "",
                    username: "",
                    email: "",
                    contactNumber: "",
                    superAdmin: false,
                    token: "",
                },
                addAdminInfo: (info) => set(() => ({ adminInfo: { ...info } })),
                adminLogout: () =>
                    set(() => ({
                        adminInfo: {
                            _id: "",
                            username: "",
                            email: "",
                            contactNumber: "",
                            superAdmin: false,
                            token: "",
                        },
                    })),
            }),
            {
                name: "admin-storage",
            }
        )
    )
);
