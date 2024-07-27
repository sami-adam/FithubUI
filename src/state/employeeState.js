import {create} from "zustand";
import axios from "axios";

const useEmployeeStore = create((set) => ({
    employees: [],
    token: localStorage.getItem("token"),
    baseURL: process.env.REACT_APP_BASE_URL,
    signInUrl: process.env.REACT_APP_SIGN_IN_URL,
    fetchEmployees: async () => {
        try {
            const response = await axios.get(useEmployeeStore.getState().baseURL + "/employees", {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set({ employees: response.data });
        } catch (error) {
            if (error.response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = useEmployeeStore.getState().signInUrl;
            } else {
                console.error("Error fetching employees", error);
            }
        }
    },
    addEmployee: async (employee) => {
        try {
            const response = await axios.post(`${useEmployeeStore.getState().baseURL}/employee`, employee, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set((state) => ({ employees: [...state.employees, response.data] }));
        } catch (error) {
            console.error("Error adding employee", error);
        }
    },
    updateEmployee: async (employee) => {
        try {
            const response = await axios.put(`${useEmployeeStore.getState().baseURL}/employee/${employee.id}`, employee, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set((state) => ({
                employees: state.employees.map((m) => (m.id === employee.id ? response.data : m)),
            }));
        } catch (error) {
            console.error("Error updating employee", error);
        }
    },
    deleteEmployee: async (id) => {
        try {
            await axios.delete(`${useEmployeeStore.getState().baseURL}/employee/${id}`, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set((state) => ({ employees: state.employees.filter((m) => m.id !== id) }));
        } catch (error) {
            console.error("Error deleting employee", error);
        }
    },
    searchEmployees: async (search) => {
        try {
            const response = await axios.get(useEmployeeStore.getState().baseURL + "/employees/search/" + search, {
                headers: {
                    "Authorization": "Bearer " + useEmployeeStore.getState().token,
                },
            });
            set({ employees: response.data });
        } catch (error) {
            console.error("Error searching employees", error);
        }
    },
}));

export default useEmployeeStore;