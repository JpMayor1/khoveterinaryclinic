import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ToggleType } from "../utils/Types";

export const toggleStore = create<ToggleType>()(
    devtools(
        persist(
            (set) => ({
                toggle: false,
                setToggle: () => set((state) => ({ toggle: !state.toggle })),
            }),
            {
                name: "toggle-storage",
            }
        )
    )
);
