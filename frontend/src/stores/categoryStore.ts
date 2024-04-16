import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CategoryStoreType } from "../utils/Types";

export const categoryStore = create<CategoryStoreType>()(
    devtools(
        persist(
            (set) => ({
                categories: [],
                setCategories: (categories) => set(() => ({ categories })),
                addCategory: (category) => {
                    set((state) => {
                        return { categories: [...state.categories, category] };
                    });
                },
                deleteCategory: (id: string) => {
                    set((state) => {
                        const newCategories = state.categories.filter(
                            (category) => category._id !== id
                        );
                        return { categories: newCategories };
                    });
                },
            }),
            {
                name: "category-storage",
            }
        )
    )
);
