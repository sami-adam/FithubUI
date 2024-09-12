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
            return { success: true, data: response.data };
        } catch (error) {
            // Navigate to the sign in page if the token is invalid
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useProductStore.getState().signInUrl;
                return { success: false, error: { message: "Invalid token!", details: error.message } };
            } else {
                return { success: false, error: { message: "Error fetching products!", details: error.message } };
            }
        }
    },
    fetchProduct: async (id) => {
        try {
            const response = await axios.get(`${useProductStore.getState().baseURL}/product/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useProductStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching product!", details: error.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding product!", details: error.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating product!", details: error.message } };
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
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting product!", details: error.message } };
        }
    },
    searchProducts: async (searchTerm) => {
       try {
            const response = await axios.get(`${useProductStore.getState().baseURL}/products/search/${searchTerm}`, {
                headers: {
                    "Authorization": "Bearer " + useProductStore.getState().token,
                },
            });
            set({ products: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching products!", details: error.message } };
        }
    },
}))

export default useProductStore;