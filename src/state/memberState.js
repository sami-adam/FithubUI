import {create} from "zustand";
import axios from "axios";

const useMemberStore = create((set) => ({
    members: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchMembers: async () => {
        try {
            const response = await axios.get(useMemberStore.getState().baseURL + "/members", {
                headers: {
                    Authorization: "Bearer " + useMemberStore.getState().token,
                },
            });
            set({ members: response.data });
        } catch (error) {
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useMemberStore.getState().signInUrl;
            } else {
                console.error("Error fetching products", error);
            }
        }
    },
    addMember: async (member) => {
        try {
            const response = await axios.post(`${useMemberStore.getState().baseURL}/member`, member, {
                headers: {
                    "Authorization": "Bearer " + useMemberStore.getState().token,
                },
            });
            set((state) => ({ members: [...state.members, response.data] }));
        } catch (error) {
            console.error("Error adding member", error);
        }
    },
    updateMember: async (member) => {
        try {
            const response = await axios.put(`${useMemberStore.getState().baseURL}/member/${member.id}`, member, {
                headers: {
                    "Authorization": "Bearer " + useMemberStore.getState().token,
                },
            });
            set((state) => ({
                members: state.members.map((m) => (m.id === member.id ? response.data : m)),
            }));
        } catch (error) {
            console.error("Error updating member", error);
        }
    },
    deleteMember: async (id) => {
        try {
            await axios.delete(`${useMemberStore.getState().baseURL}/member/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useMemberStore.getState().token,
                },
            });
            set((state) => ({ members: state.members.filter((m) => m.id !== id) }));
        } catch (error) {
            console.error("Error deleting member", error);
        }
    },
    searchMembers: async (search) => {
        try {
            const response = await axios.get(`${useMemberStore.getState().baseURL}/members/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useMemberStore.getState().token,
                },
            });
            set({ members: response.data });
        } catch (error) {
            console.error("Error searching members", error);
        }
    }
}))

export default useMemberStore;