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
        } catch (error) {
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useBenefitStore.getState().signInUrl;
            } else {
                console.error("Error fetching benefits", error);
            }
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
        } catch (error) {
            console.error("Error adding benefit", error);
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
        } catch (error) {
            console.error("Error updating benefit", error);
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
        } catch (error) {
            console.error("Error deleting benefit", error);
        }
    },
    SearchBenefits: async (search) => {
        try {
            const response = await axios.get(`${useBenefitStore.getState().baseURL}/benefits/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useBenefitStore.getState().token,
                },
            });
            set({ benefits: response.data });
        } catch (error) {
            console.error("Error searching benefits", error);
        }
    }
}));

export default useBenefitStore;