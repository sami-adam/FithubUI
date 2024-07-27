import {create} from "zustand";
import axios from "axios";

const useProductStore = create((set) => ({
    products: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchProducts: async () => {
        try {
            const response = await axios.get(useProductStore.getState().baseURL + "/products", {
                headers: {
                    "Authorization": "Bearer " + useProductStore.getState().token,
                },
            });
            set({ products: response.data });
        } catch (error) {
            // Navigate to the sign in page if the token is invalid
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useProductStore.getState().signInUrl;
            } else {
                console.error("Error fetching products", error);
            }
        }
    },
    addProduct: async (product) => {
        try {
            const response = await axios.post(useProductStore.getState().baseURL + "/product", product, {
                headers: {
                    "Authorization": "Bearer " + useProductStore.getState().token,
                },
            });
            set((state) => ({ products: [...state.products, response.data] }));
        } catch (error) {
            console.error("Error adding product", error);
        }
    },
    updateProduct: async (product) => {
        try {
            const response = await axios.put(useProductStore.getState().baseURL + `/product/${product.id}`, product, {
                headers: {
                    "Authorization": "Bearer " + useProductStore.getState().token,
                },
            });
            set((state) => ({
                products: state.products.map((p) => (p.id === product.id ? response.data : p)),
            }));
        } catch (error) {
            console.error("Error updating product", error);
        }
    },
    deleteProduct: async (id) => {
        try {
            await axios.delete(useProductStore.getState().baseURL + `/product/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useProductStore.getState().token,
                },
            });
            set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        } catch (error) {
            console.error("Error deleting product", error);
        }
    }
}))

export default useProductStore;