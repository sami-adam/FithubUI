import { useEffect } from "react";
import useEmployeeStore from "../state/employeeState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useTranslation } from "react-i18next";

export default function EmployeePage() {
    const [employees, fetchEmployees] = useEmployeeStore((state) => [state.employees, state.fetchEmployees]);

    const {t} = useTranslation();

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const columns = [
        {"name": "id", "label": "Identification Number", "width": 120},
        {"name": "name", "label": "Full Name", "sort": true, "width": 120},
        {"name": "employeeType", "label": "Employee Type", "width": 120},
        {"name": "email", "label": "Email", "width": 180},
        {"name": "phone", "label": "Phone"},
        {"name": "address", "label": "Address", "width": 200},
    ]

    const rows = employees.map((employee) => ({
        "id": employee.identificationNumber,
        "name": employee.name,
        "email": employee.email,
        "phone": employee.phone,
        "address": employee.address,
        "employeeType": t(employee.employeeType),
        "object": employee
    }));

    const listItems = employees.map((employee) => ({
        "id": employee.identificationNumber,
        "avatar": employee.name.charAt(0),
        "title": employee.name,
        "subtitle": employee.email,
        "firstRow": [employee.address, employee.identificationNumber],
        "secondRow": [employee.phone, ""],
        "thirdRow": [employee.email, t(employee.employeeType)],
        "status": "NEW",
        "object": employee
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Employees" formUrl="/employee-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/employee-form"/>
        </div>
    );
}