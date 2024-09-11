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
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useEntryStore.getState().signInUrl;
            }
        }
    },
    fetchEntry: async (id) => {
        try {
            const response = await axios.get(`${useEntryStore.getState().baseURL}/entry/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEntryStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching entry", error);
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
        } catch (error) {
            console.error("Error adding entry", error);
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
        } catch (error) {
            console.error("Error updating entry", error);
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
        } catch (error) {
            console.error("Error deleting entry", error);
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
        } catch (error) {
            console.error("Error fetching entries", error);
        }
    }
}));

export default useEntryStore;