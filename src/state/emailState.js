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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching emails!", details: error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding email!", details: error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating email!", details: error.response.data.message } };
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
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting email!", details: error.response.data.message } };
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
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching emails!", details: error.response.data.message } };
        }
    }
}))

export default useEmailStore;