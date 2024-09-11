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
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useMembershipStore.getState().signInUrl;
            }
        }
    },
    fetchMembership: async (id) => {
        try {
            const response = await axios.get(`${useMembershipStore.getState().baseURL}/membership/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useMembershipStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching membership", error);
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
        } catch (error) {
            console.error("Error adding membership", error);
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
        } catch (error) {
            console.error("Error updating membership", error);
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
        } catch (error) {
            console.error("Error deleting membership", error);
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
        } catch (error) {
            console.error("Error searching memberships", error);
        }
    },
}));

export default useMembershipStore;