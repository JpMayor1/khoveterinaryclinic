import { create } from "zustand";
import {
    InvoiceProductStateType,
    InvoiceProductStoreType,
} from "../utils/Types";

export const invoiceProductStore = create<InvoiceProductStoreType>((set) => ({
    selectedProducts: [],
    addProduct: (product: InvoiceProductStateType) =>
        set((state) => {
            const existingProductIndex = state.selectedProducts.findIndex(
                (p) => p._id === product._id
            );

            if (existingProductIndex !== -1) {
                // Product already exists, update its quantity
                const updatedProducts = [...state.selectedProducts];
                updatedProducts[existingProductIndex].quantity++;
                return { selectedProducts: updatedProducts };
            } else {
                // Product doesn't exist, add it to the list
                return {
                    selectedProducts: [...state.selectedProducts, product],
                };
            }
        }),
    increaseQuantity: (id) =>
        set((state) => ({
            selectedProducts: state.selectedProducts.map((product) =>
                product._id === id && product.quantity < product.stock // Check if quantity is less than stock
                    ? {
                          ...product,
                          quantity: product.quantity + 1,
                      }
                    : product
            ),
        })),
    decreaseQuantity: (id) =>
        set((state) => ({
            selectedProducts: state.selectedProducts.map((product) =>
                product._id === id && product.quantity > 1
                    ? {
                          ...product,
                          quantity: product.quantity - 1,
                      }
                    : product
            ),
        })),
    removeProduct: (id) =>
        set((state) => ({
            selectedProducts: state.selectedProducts.filter(
                (product) => product._id !== id
            ),
        })),
    removeAllProducts: () =>
        set(() => ({
            selectedProducts: [],
        })),
}));
