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
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useFitnessClassStore.getState().signInUrl;
            } else {
                console.error("Error fetching fitness classes", error);
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
            return response.data;
        } catch (error) {
            console.error("Error fetching fitness class", error);
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
        } catch (error) {
            console.error("Error adding fitness class", error);
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
        } catch (error) {
            console.error("Error updating fitness class", error);
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
        } catch (error) {
            console.error("Error deleting fitness class", error);
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
        } catch (error) {
            console.error("Error searching fitness classes", error);
        }
    },
}));

export default useFitnessClassStore;