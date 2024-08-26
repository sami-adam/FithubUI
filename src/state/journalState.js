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
        } catch (error) {
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useJournalStore.getState().signInUrl;
            } else {
                console.error("Error fetching journals", error);
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
            return response.data;
        } catch (error) {
            console.error("Error fetching journal", error);
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
        } catch (error) {
            console.error("Error adding journal", error);
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
        } catch (error) {
            console.error("Error updating journal", error);
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
        } catch (error) {
            console.error("Error deleting journal", error);
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
        } catch (error) {
            console.error("Error searching journals", error);
        }
    }
}));

export default useJournalStore;