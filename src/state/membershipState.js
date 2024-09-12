import {create} from "zustand";
import axios from "axios";

const useMembershipStore = create((set) => ({
    memberships: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchMemberships: async () => {
        try {
            const response = await axios.get(useMembershipStore.getState().baseURL + "/memberships", {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            set({ memberships: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useMembershipStore.getState().signInUrl;
                return { success: false, error: { message: "Unauthorized", details: "You are not authorized to view this page!" } };
            }
            return { success: false, error: { message: "Error fetching memberships!", details: error.response.data.message } };
        }
    },
    fetchMembership: async (id) => {
        try {
            const response = await axios.get(`${useMembershipStore.getState().baseURL}/membership/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching membership!", details: error.response.data.message } };
        }
    },
    addMembership: async (membership) => {
        try {
            const response = await axios.post(`${useMembershipStore.getState().baseURL}/membership`, membership, {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            set((state) => ({ memberships: [...state.memberships, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding membership!", details: error.response.data.message } };
        }
    },
    updateMembership: async (membership) => {
        try {
            const response = await axios.put(`${useMembershipStore.getState().baseURL}/membership/${membership.id}`, membership, {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            set((state) => ({
                memberships: state.memberships.map((m) => (m.id === membership.id ? response.data : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating membership!", details: error.response.data.message } };
        }
    },
    deleteMembership: async (id) => {
        try {
            await axios.delete(`${useMembershipStore.getState().baseURL}/membership/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            set((state) => ({ memberships: state.memberships.filter((m) => m.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting membership!", details: error.response.data.message } };
        }
    },
    searchMemberships: async (searchTerm) => {
        try {
            const response = await axios.get(`${useMembershipStore.getState().baseURL}/memberships/search/${searchTerm}`, {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            set({ memberships: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching memberships!", details: error.response.data.message } };
        }
    },
}));

export default useMembershipStore;