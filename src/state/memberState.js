import {create} from "zustand";
import axios from "axios";

const useMemberStore = create((set) => ({
    members: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    error: null,
    fetchMembers: async () => {
        try {
            const response = await axios.get(useMemberStore.getState().baseURL + "/members", {
                headers: {
                    Authorization: "Bearer " + useMemberStore.getState().token,
                },
            });
            set({ members: response.data });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useMemberStore.getState().signInUrl;
                set({ error: { message: "Session expired, Please sign in again!", details: error } });
            } else {
                set({ error: { message: "Error fetching members!", details: error } });
            }
        }
    },
    fetchMember: async (id) => {
        try {
            const response = await axios.get(`${useMemberStore.getState().baseURL}/member/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useMemberStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            set({ error: { message: "Error fetching member!", details: error } });
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
            set({ error: { message: "Error adding member!", details: error } });
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
            set({ error: { message: "Error updating member!", details: error } });
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
            set({ error: { message: "Error deleting member!", details: error } });
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
            set({ error: { message: "Error searching members!", details: error } });
        }
    },
    uploadProfilePicture: async (id, file) => {
        const formData = new FormData();
        formData.append("attachment", file);
        try {
            const response = await axios.post(`${useMemberStore.getState().baseURL}/member/${id}/picture`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + useMemberStore.getState().token
                },
            });
            set((state) => ({
                members: state.members.map((m) => (m.id === id ? response.data : m)),
            }));
            return response.data;
        } catch (error) {
            set({ error: { message: "Error uploading profile picture!", details: error } });
        }
    },
    deleteProfilePicture: async (id) => {
        try {
            const response = await axios.delete(`${useMemberStore.getState().baseURL}/member/${id}/picture`, {
                headers: {
                    "Authorization": "Bearer " + useMemberStore.getState().token,
                },
            });
            set((state) => ({
                members: state.members.map((m) => (m.id === id ? response.data : m)),
            }));
        } catch (error) {
            set({ error: { message: "Error deleting profile picture!", details: error } });
        }
    }
}))

export default useMemberStore;