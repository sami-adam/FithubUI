import {create} from "zustand";
import axios from "axios";

const useClassScheduleStore = create((set) => ({
    "classSchedules": [],
    "token": localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,

    fetchClassSchedules: async () => {
        try {
            const response = await axios.get(useClassScheduleStore.getState().baseURL + "/class-schedules", {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            set({ classSchedules: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching class schedules!", details: error.message } };
        }
    },
    fetchClassSchedule: async (id) => {
        try {
            const response = await axios.get(`${useClassScheduleStore.getState().baseURL}/class-schedule/${
                id
            }`, {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error fetching class schedule!", details: error.message } };   
        }
    },

    addClassSchedule: async (classSchedule) => {
        try {
            const response = await axios.post(`${useClassScheduleStore.getState().baseURL}/class-schedule`, classSchedule, {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            set((state) => ({ classSchedules: [...state.classSchedules, response.data] }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error adding class schedule!", details: error.message } };
        }
    },

    updateClassSchedule: async (classSchedule) => {
        try {
            const response = await axios.put(`${useClassScheduleStore.getState().baseURL}/class-schedule/${classSchedule.id}`, classSchedule, {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            set((state) => ({
                classSchedules: state.classSchedules.map((m) => (m.id === classSchedule.id ? response.data : m)),
            }));
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error updating class schedule!", details: error.message } };
        }
    },

    deleteClassSchedule: async (id) => {
        try {
            await axios.delete(`${useClassScheduleStore.getState().baseURL}/class-schedule/${ id }`, {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            set((state) => ({ classSchedules: state.classSchedules.filter((m) => m.id !== id) }));
            return { success: true };
        } catch (error) {
            return { success: false, error: { message: "Error deleting class schedule!", details: error.message } };
        }
    },

    SearchClassSchedules: async (search) => {
        try {
            const response = await axios.get(useClassScheduleStore.getState().baseURL + "/class-schedules/search/" + search, {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            set({ classSchedules: response.data });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error searching class schedules!", details: error.message } };
        }
    },
    enrollMember: async (classScheduleId) => {
        try {
            const response = await axios.post(`${useClassScheduleStore.getState().baseURL}/class-schedule/enroll/${classScheduleId}`, {}, {
                headers: {
                    "Authorization": "Bearer " + useClassScheduleStore.getState().token,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: { message: "Error enrolling member!", details: error.message } };
        }
    }
}));

export default useClassScheduleStore;
