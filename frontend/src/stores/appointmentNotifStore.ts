import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { appointmentNotifStoreType } from "../utils/Types";

export const appointmentNotifStore = create<appointmentNotifStoreType>()(
    devtools(
        persist(
            (set) => ({
                appointments: 0,
                setAppointments: (appointments: number) =>
                    set(() => ({ appointments })),
            }),
            {
                name: "appointmentNotif-storage",
            }
        )
    )
);
