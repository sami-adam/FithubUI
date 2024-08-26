import { useEffect, useState } from "react";
import useClassScheduleStore from "../state/classScheduleState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function ClassSchedulePage({ defaultSearch="" }) {
    const [classSchedules, fetchClassSchedules] = useClassScheduleStore((state) => [state.classSchedules, state.fetchClassSchedules]);
    const searchClassSchedules = useClassScheduleStore((state) => state.searchClassSchedules);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchClassSchedules();
        }
        if (search !== "") {
            searchClassSchedules(search);
        }
    }, [fetchClassSchedules, search, searchClassSchedules, defaultSearch]);

    const columns = [
        {"name": "id", "label": "Reference", "width": 140},
        {"name": "class", "label": "Class", "sort": true, "width": 120},
        {"name": "startDate" , "label": "Start Date", "width": 120},
        {"name": "endDate", "label": "End Date", "width": 120},
        {"name": "instructor", "label": "Instructor", "width": 300, "special": "person"},
        {"name": "price", "label": "Price", "width": 120, "special": "amount"},
        {"name": "status", "label": "Status", "width": 120, "special": "status"}
    ]

    const rows = classSchedules.map((classSchedule) => ({
        "id": classSchedule.reference,
        "class": classSchedule.fitnessClass && classSchedule.fitnessClass.name,
        "startDate": classSchedule.startDate.substring(0, 10),
        "endDate": classSchedule.endDate.substring(0, 10),
        "instructor": classSchedule.instructor && classSchedule.instructor.name,
        "name": classSchedule.instructor && classSchedule.instructor.name,
        "email": classSchedule.instructor && classSchedule.instructor.email,
        "price": classSchedule.price,
        "status": classSchedule.status,
        "objectId": classSchedule.id
    }));

    const listItems = classSchedules.map((classSchedule) => ({
        "id": classSchedule.reference,
        "avatar": classSchedule.fitnessClass && classSchedule.fitnessClass.name && classSchedule.fitnessClass.name.charAt(0),
        "title": classSchedule.fitnessClass && classSchedule.fitnessClass.name,
        "subtitle": classSchedule.startDate + " - " + classSchedule.endDate,
        "firstRow": [classSchedule.instructor && classSchedule.instructor.name, classSchedule.price],
        "secondRow": [classSchedule.status, ""],
        "objectId": classSchedule.id
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} setSearch={setSearch} pageTitle="Class Schedules" formUrl="/class-schedule-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/class-schedule-form"/>
        </div>
    );
}