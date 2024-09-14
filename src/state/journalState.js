import {create} from "zustand";
import axios from "axios";

const useJournalStore = create((set) => ({
    journals: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchJournals: async () => {
        try {
            const response = await axios.get(useJournalStore.getState().baseURL + "/journals", {
                headers: {
                    "Authorization": "Bearer " + useJournalStore.getState().token,
                },
            });
            set({ journals: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useJournalStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            } else {
                return { success: false, error: { message: "Error fetching journals!", details: error.response&&error.response.data.message } };
            }
        }
    },
    fetchJournal: async (id) => {
        try {
            const response = await axios.get(`${useJournalStore.getState().baseURL}/journal/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useJournalStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching journal!", details: error.response&&error.response.data.message } };
        }
    },
    addJournal: async (journal) => {
        try {
            const response = await axios.post(`${useJournalStore.getState().baseURL}/journal`, journal, {
                headers: {
                    "Authorization": "Bearer " + useJournalStore.getState().token,
                },
            });
            set((state) => ({ journals: [...state.journals, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding journal!", details: error.response&&error.response.data.message } };
        }
    },
    updateJournal: async (journal) => {
        try {
            const response = await axios.put(`${useJournalStore.getState().baseURL}/journal/${journal.id}`, journal, {
                headers: {
                    "Authorization": "Bearer " + useJournalStore.getState().token,
                },
            });
            set((state) => ({
                journals: state.journals.map((m) => (m.id === journal.id ? response.data : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating journal!", details: error.response&&error.response.data.message } };
        }
    },
    deleteJournal: async (id) => {
        try {
            await axios.delete(`${useJournalStore.getState().baseURL}/journal/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useJournalStore.getState().token,
                },
            });
            set((state) => ({ journals: state.journals.filter((m) => m.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting journal!", details: error.response&&error.response.data.message } };
        }
    },
    searchJournals: async (search) => {
        try {
            const response = await axios.get(`${useJournalStore.getState().baseURL}/journals/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useJournalStore.getState().token,
                },
            });
            set({ journals: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching journals!", details: error.response&&error.response.data.message } };
        }
    }
}));

export default useJournalStore;