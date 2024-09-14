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
            return { success: true , data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching product categories!", details: error.response&&error.response.data.message } };
        }
    },
    fetchProductCategory: async (id) => {
        try {
            const response = await axios.get(useProductCategoryStore.getState().baseURL + `/product-category/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useProductCategoryStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching product category!", details: error.response&&error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding product category!", details: error.response&&error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating product category!", details: error.response&&error.response.data.message } };   
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
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting product category!", details: error.response&&error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching product categories!", details: error.response&&error.response.data.message } };
        }
    },
}))

export default useProductCategoryStore;