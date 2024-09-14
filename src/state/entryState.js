import {create} from "zustand";
import axios from "axios";

const useEntryStore = create((set) => ({
    entries: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchEntries: async () => {
        try {
            const response = await axios.get(useEntryStore.getState().baseURL + "/entries", {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            set({ entries: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useEntryStore.getState().signInUrl;
            }
            return { success: false, error: { message: "Error fetching entries!", details: error.response&&error.response.data.message} };
        }
    },
    fetchEntry: async (id) => {
        try {
            const response = await axios.get(`${useEntryStore.getState().baseURL}/entry/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching entry!", details: error.response&&error.response.data.message } };
        }
    },
    addEntry: async (entry) => {
        try {
            const response = await axios.post(`${useEntryStore.getState().baseURL}/entry`, entry, {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            set((state) => ({ entries: [...state.entries, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding entry!", details: error.response&&error.response.data.message } };
        }
    },
    updateEntry: async (entry) => {
        try {
            const response = await axios.put(`${useEntryStore.getState().baseURL}/entry/${entry.id}`, entry, {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            set((state) => ({
                entries: state.entries.map((m) => (m.id === entry.id ? response.data : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating entry!", details: error.response&&error.response.data.message } };
        }
    },
    deleteEntry: async (id) => {
        try {
            await axios.delete(`${useEntryStore.getState().baseURL}/entry/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            set((state) => ({ entries: state.entries.filter((m) => m.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting entry!", details: error.response&&error.response.data.message } };
        }
    },
    searchEntries: async (searchTerm) => {
        try {
            const response = await axios.get(`${useEntryStore.getState().baseURL}/entries/search/${searchTerm}`, {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            set({ entries: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching entries!", details: error.response&&error.response.data.message } };
        }
    }
}));

export default useEntryStore;