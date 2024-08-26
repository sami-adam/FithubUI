import {create} from "zustand";
import axios from "axios";
import { Search } from "@mui/icons-material";

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
        } catch (error) {
            console.error("Error fetching class schedules", error);
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
            return response.data;
        } catch (error) {
            console.error("Error fetching class schedule", error);
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
        } catch (error) {
            console.error("Error adding class schedule", error);
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
        } catch (error) {
            console.error("Error updating class schedule", error);
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
        } catch (error) {
            console.error("Error deleting class schedule", error);
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
        } catch (error) {
            console.error("Error fetching class schedules", error);
        }
    }
}));

export default useClassScheduleStore;
