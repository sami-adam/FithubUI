import {create} from "zustand";
import axios from "axios";

const useTaxStore = create((set) => ({
    taxes: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchTaxes: async () => {
        try {
            const response = await axios.get(useTaxStore.getState().baseURL + "/taxes", {
                headers: {
                    "Authorization": "Bearer " + useTaxStore.getState().token,
                },
            });
            set({ taxes: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            // Navigate to the sign in page if the token is invalid
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useTaxStore.getState().signInUrl;
                return { success: false, error: { message: "Invalid token!", details: error.response&&error.response.data.message } };
            } else {
                return { success: false, error: { message: "Error fetching taxes!", details: error.response&&error.response.data.message } };
            }
        }
    },
    fetchTax: async (id) => {
        try {
            const response = await axios.get(useTaxStore.getState().baseURL + `/tax/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useTaxStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching tax!", details: error.response&&error.response.data.message } };
        }
    },
    addTax: async (tax) => {
        try {
            const response = await axios.post(useTaxStore.getState().baseURL + "/tax", tax, {
                headers: {
                    "Authorization": "Bearer " + useTaxStore.getState().token,
                },
            });
            set((state) => ({ taxes: [...state.taxes, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding tax!", details: error.response&&error.response.data.message } };
        }
    },
    updateTax: async (tax) => {
        try {
            const response = await axios.put(useTaxStore.getState().baseURL + `/tax/${tax.id}`, tax, {
                headers: {
                    "Authorization": "Bearer " + useTaxStore.getState().token,
                },
            });
            set((state) => ({
                taxes: state.taxes.map((t) => (t.id === tax.id ? response.data : t)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating tax!", details: error.response&&error.response.data.message } };
        }
    },
    deleteTax: async (id) => {
        try {
            await axios.delete(useTaxStore.getState().baseURL + `/tax/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useTaxStore.getState().token,
                },
            });
            set((state) => ({ taxes: state.taxes.filter((t) => t.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting tax!", details: error.response&&error.response.data.message } };
        }
    },
    searchTaxes: async (search) => {
        try {
            const response = await axios.get(useTaxStore.getState().baseURL + `/taxes/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useTaxStore.getState().token,
                },
            });
            set({ taxes: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching taxes!", details: error.response&&error.response.data.message } };
        }
    }
}));

export default useTaxStore;