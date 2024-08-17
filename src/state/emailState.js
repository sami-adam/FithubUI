import {create} from "zustand";
import axios from "axios";

const useEmailStore = create((set) => ({
    emails: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchEmails: async () => {
        try {
            const response = await axios.get(useEmailStore.getState().baseURL + "/emails", {
                headers: {
                    "Authorization": "Bearer " + useEmailStore.getState().token,
                },
            });
            set({ emails: response.data });
        } catch (error) {
            console.error("Error fetching emails", error);
        }
    },
    addEmail: async (email) => {
        try {
            const response = await axios.post(`${useEmailStore.getState().baseURL}/email2`, email, {
                headers: {
                    "Authorization": "Bearer " + useEmailStore.getState().token,
                },
            });
            set((state) => ({ emails: [...state.emails, response.data] }));
        } catch (error) {
            console.error("Error adding email", error);
        }
    },
    updateEmail: async (email) => {
        try {
            const response = await axios.put(`${useEmailStore.getState().baseURL}/email/${email.id}`, email, {
                headers: {
                    "Authorization": "Bearer " + useEmailStore.getState().token,
                },
            });
            set((state) => ({
                emails: state.emails.map((e) => (e.id === email.id ? response.data : e)),
            }));
        } catch (error) {
            console.error("Error updating email", error);
        }
    },
    deleteEmail: async (id) => {
        try {
            await axios.delete(`${useEmailStore.getState().baseURL}/email/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEmailStore.getState().token,
                },
            });
            set((state) => ({ emails: state.emails.filter((e) => e.id !== id) }));
        } catch (error) {
            console.error("Error deleting email", error);
        }
    },
    serachEmails: async (search) => {
        try {
            const response = await axios.get(useEmailStore.getState().baseURL + "/emails/search/" + search, {
                headers: {
                    "Authorization": "Bearer " + useEmailStore.getState().token,
                },
            });
            set({ emails: response.data });
        } catch (error) {
            console.error("Error fetching emails", error);
        }
    }
}))

export default useEmailStore;