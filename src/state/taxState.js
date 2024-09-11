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
        } catch (error) {
            // Navigate to the sign in page if the token is invalid
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useTaxStore.getState().signInUrl;
            } else {
                console.error("Error fetching taxes", error);
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
            return response.data;
        } catch (error) {
            console.error("Error fetching tax", error);
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
        } catch (error) {
            console.error("Error adding tax", error);
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
        } catch (error) {
            console.error("Error updating tax", error);
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
        } catch (error) {
            console.error("Error deleting tax", error);
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
        } catch (error) {
            console.error("Error searching taxes", error);
        }
    }
}));

export default useTaxStore;