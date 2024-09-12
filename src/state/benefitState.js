import {create} from "zustand";
import axios from "axios";
import { Search } from "@mui/icons-material";

const useBenefitStore = create((set) => ({
    benefits: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchBenefits: async () => {
        try {
            const response = await axios.get(useBenefitStore.getState().baseURL + "/benefits", {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            set({ benefits: response.data });
            return {success: true, data: response.data};
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useBenefitStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            } else {
                return { success: false, error: { message: "Error fetching benefits!", details: error.message}};
            }
        }
    },
    fetchBenefit: async (id) => {
        try {
            const response = await axios.get(`${useBenefitStore.getState().baseURL}/benefit/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error fetching benefit!", details: error.message}};
        }
    },
    addBenefit: async (benefit) => {
        try {
            const response = await axios.post(`${useBenefitStore.getState().baseURL}/benefit`, benefit, {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            set((state) => ({ benefits: [...state.benefits, response.data] }));
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error adding benefit!", details: error.message}};
        }
    },
    updateBenefit: async (benefit) => {
        try {
            const response = await axios.put(`${useBenefitStore.getState().baseURL}/benefit/${benefit.id}`, benefit, {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            set((state) => ({
                benefits: state.benefits.map((b) => (b.id === benefit.id ? response.data : b)),
            }));
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error updating benefit!", details: error.message}};
        }
    },
    deleteBenefit: async (id) => {
        try {
            await axios.delete(`${useBenefitStore.getState().baseURL}/benefit/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            set((state) => ({ benefits: state.benefits.filter((b) => b.id !== id) }));
            return {success: true};
        } catch (error) {
            return { success: false, error: { message: "Error deleting benefit!", details: error.message}};
        }
    },
    searchBenefits: async (search) => {
        try {
            const response = await axios.get(`${useBenefitStore.getState().baseURL}/benefits/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            set({ benefits: response.data });
            return {success: true, data: response.data};
        } catch (error) {
            return { success: false, error: { message: "Error searching benefits!", details: error.message}};
        }
    }
}));

export default useBenefitStore;