import {create} from "zustand";
import axios from "axios";

const useFitnessClassStore = create((set) => ({
    fitnessClasses: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchFitnessClasses: async () => {
        try {
            const response = await axios.get(useFitnessClassStore.getState().baseURL + "/fitness-classes", {
                headers: {
                    Authorization: "Bearer " + useFitnessClassStore.getState().token,
                },
            });
            set({ fitnessClasses: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useFitnessClassStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            } else {
                return { success: false, error: { message: "Error fetching fitness classes!", details: error.response.data.message } };
            }
        }
    },
    fetchFitnessClass: async (id) => {
        try {
            const response = await axios.get(`${useFitnessClassStore.getState().baseURL}/fitness-class/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useFitnessClassStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching fitness class!", details: error.response.data.message } };
        }
    },
    addFitnessClass: async (fitnessClass) => {
        try {
            const response = await axios.post(`${useFitnessClassStore.getState().baseURL}/fitness-class`, fitnessClass, {
                headers: {
                    "Authorization": "Bearer " + useFitnessClassStore.getState().token,
                },
            });
            set((state) => ({ fitnessClasses: [...state.fitnessClasses, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding fitness class!", details: error.response.data.message } };
        }
    },
    updateFitnessClass: async (fitnessClass) => {
        try {
            const response = await axios.put(`${useFitnessClassStore.getState().baseURL}/fitness-class/${fitnessClass.id}`, fitnessClass, {
                headers: {
                    "Authorization": "Bearer " + useFitnessClassStore.getState().token,
                },
            });
            set((state) => ({
                fitnessClasses: state.fitnessClasses.map((fc) => (fc.id === fitnessClass.id ? response.data : fc)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating fitness class!", details: error.response.data.message } };
        }
    },
    deleteFitnessClass: async (id) => {
        try {
            await axios.delete(`${useFitnessClassStore.getState().baseURL}/fitness-class/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useFitnessClassStore.getState().token,
                },
            });
            set((state) => ({ fitnessClasses: state.fitnessClasses.filter((fc) => fc.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting fitness class!", details: error.response.data.message } };
        }
    },
    searchFitnessClasses: async (search) => {
        try {
            const response = await axios.get(`${useFitnessClassStore.getState().baseURL}/fitness-classes/search/${search}`, {
                headers: {
                    Authorization: "Bearer " + useFitnessClassStore.getState().token,
                },
            });
            set({ fitnessClasses: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching fitness classes!", details: error.response.data.message } };
        }
    },
}));

export default useFitnessClassStore;