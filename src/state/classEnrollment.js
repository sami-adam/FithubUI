import {create} from "zustand";
import axios from "axios";

const useClassEnrollmentStore = create((set) => ({
    classEnrollments: [],
    classEnrollment: null,
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    error: null,
    fetchClassEnrollments: async () => {
        try {
            const response = await axios.get(useClassEnrollmentStore.getState().baseURL + "/class-enrollments", {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            set({ classEnrollments: response.data });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useClassEnrollmentStore.getState().signInUrl;
                set({ error: { message: "Please sign in", details: error.response.data } });
            } else {
                set({ error: { message: "Error fetching class enrollments!", details: error } });
            }
        }
    },
    fetchClassEnrollment: async (id) => {
        try {
            const response = await axios.get(`${useClassEnrollmentStore.getState().baseURL}/class-enrollment/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            return response.data;
        } catch (error) {
            set({ error: { message: "Error fetching class enrollment!", details: error } });
        }
    },
    addClassEnrollment: async (classEnrollment) => {
        try {
            const response = await axios.post(`${useClassEnrollmentStore.getState().baseURL}/class-enrollment`, classEnrollment, {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            set((state) => ({ classEnrollments: [...state.classEnrollments, response.data] }));
            set({ classEnrollment: response.data });
        } catch (error) {
            set({ error: { message: "Error adding class enrollment!", details: error } });
            return { error: { message: "Error adding class enrollment!", details: error } };
        }
    },
    updateClassEnrollment: async (classEnrollment) => {
        try {
            const response = await axios.put(`${useClassEnrollmentStore.getState().baseURL}/class-enrollment/${classEnrollment.id}`, classEnrollment, {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            set((state) => ({
                classEnrollments: state.classEnrollments.map((b) => (b.id === classEnrollment.id ? response.data : b)),
            }));
            set({ classEnrollment: response.data });
        } catch (error) {
            set({ error: { message: "Error updating class enrollment!", details: error } });
        }
    },
    deleteClassEnrollment: async (id) => {
        try {
            await axios.delete(`${useClassEnrollmentStore.getState().baseURL}/class-enrollment/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            set((state) => ({
                classEnrollments: state.classEnrollments.filter((b) => b.id !== id),
            }));
        } catch (error) {
            set({ error: { message: "Error deleting class enrollment!", details: error } });
        }
    },
    searchClassEnrollments: async (search) => {
        try {
            const response = await axios.get(`${useClassEnrollmentStore.getState().baseURL}/class-enrollments/search/${search}`, {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            set({ classEnrollments: response.data });
            return response.data;
        } catch (error) {
            set({ error: { message: "Error searching class enrollments!", details: error } });
        }
    },
    getMemberClassEnrollments: async (memberId) => {
        try {
            const response = await axios.get(`${useClassEnrollmentStore.getState().baseURL}/class-enrollments/member/${memberId}`, {
                headers: {
                    "Authorization": "Bearer " + useClassEnrollmentStore.getState().token,
                },
            });
            set({ classEnrollments: response.data });
            return response.data;
        } catch (error) {
            set({ error: { message: "Error fetching class enrollments!", details: error } });
        }
    }
}));

export default useClassEnrollmentStore;