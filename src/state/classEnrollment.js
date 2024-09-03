import {create} from "zustand";
import axios from "axios";

const useClassEnrollmentStore = create((set) => ({
    classEnrollments: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
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
            } else {
                console.error("Error fetching classEnrollments", error);
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
            console.error("Error fetching classEnrollment", error);
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
        } catch (error) {
            console.error("Error adding classEnrollment", error);
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
        } catch (error) {
            console.error("Error updating classEnrollment", error);
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
            console.error("Error deleting classEnrollment", error);
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
            console.error("Error searching classEnrollments", error);
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
            console.error("Error fetching member classEnrollments", error);
        }
    }
}));

export default useClassEnrollmentStore;