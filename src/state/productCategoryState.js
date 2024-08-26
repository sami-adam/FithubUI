import {create} from "zustand";
import axios from "axios";

const useProductCategoryStore = create((set) => ({
    productCategories: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchProductCategories: async () => {
        try {
            const response = await axios.get(useProductCategoryStore.getState().baseURL + "/product-categories", {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            set({ productCategories: response.data });
        } catch (error) {
            console.error("Error fetching product categories", error);
        }
    },
    fetchProductCategory: async (id) => {
        try {
            const response = await axios.get(useProductCategoryStore.getState().baseURL + `/product-category/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching product category", error);
        }
    },
    addProductCategory: async (productCategory) => {
        try {
            const response = await axios.post(useProductCategoryStore.getState().baseURL + "/product-category", productCategory, {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            set((state) => ({ productCategories: [...state.productCategories, response.data] }));
        } catch (error) {
            console.error("Error adding product category", error);
        }
    },
    updateProductCategory: async (productCategory) => {
        try {
            const response = await axios.put(useProductCategoryStore.getState().baseURL + `/product-category/${productCategory.id}`, productCategory, {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            set((state) => ({
                productCategories: state.productCategories.map((p) => (p.id === productCategory.id ? response.data : p)),
            }));
        } catch (error) {
            console.error("Error updating product category", error);
        }
    },
    deleteProductCategory: async (productCategoryId) => {
        try {
            await axios.delete(useProductCategoryStore.getState().baseURL + `/product-category/${productCategoryId}`, {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            set((state) => ({
                productCategories: state.productCategories.filter((p) => p.id !== productCategoryId),
            }));
        } catch (error) {
            console.error("Error deleting product category", error);
        }
    },
    searchProductCategories: async (search) => {
        try {
            const response = await axios.get(useProductCategoryStore.getState().baseURL + `/product-categories/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            set({ productCategories: response.data });
        } catch (error) {
            console.error("Error searching product categories", error);
        }
    },
}))

export default useProductCategoryStore;