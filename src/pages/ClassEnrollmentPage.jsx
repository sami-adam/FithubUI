import { useEffect, useState } from "react";
import useClassEnrollmentStore from "../state/classEnrollment";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";

export default function ClassEnrollmentPage({ defaultSearch="" }) {
    const [classEnrollments, fetchClassEnrollments] = useClassEnrollmentStore((state) => [state.classEnrollments, state.fetchClassEnrollments]);
    const getMemberClassEnrollments = useClassEnrollmentStore((state) => state.getMemberClassEnrollments);
    const searchClassEnrollments = useClassEnrollmentStore((state) => state.searchClassEnrollments);

    const location = useLocation();
    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    const {t} = useTranslation();

    const {id} = useParams();
    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            if(window.location.pathname.includes("/class-enrollments/member/")) {
                getMemberClassEnrollments(id);
            }
            else {
                fetchClassEnrollments();
            }
        }
        if (search !== "") {
            searchClassEnrollments(search);
        }
    }, [fetchClassEnrollments, search, searchClassEnrollments, defaultSearch]);

    const columns = [
        {"name": "id", "label": "Reference", "width": 140},
        {"name": "member", "label": "Member", "sort": true, "width": 250, "special": "person"},
        {"name": "fitnessClass", "label": "Fitness Class", "sort": true, "width": 120},
        {"name": "classSchedule", "label": "Class Schedule", "width": 120},
        {"name": "startDate" , "label": "Start Date", "width": 120},
        {"name": "endDate", "label": "End Date", "width": 120},
        {"name": "instructor", "label": "Instructor", "width": 120},
        {"name": "price", "label": "Price", "width": 120, "special": "amount"},
        {"name": "status", "label": "Status", "width": 120, "special": "status"}
    ]

    const rows = classEnrollments.map((classEnrollment) => ({
        "id": classEnrollment.reference,
        "member": classEnrollment.member && classEnrollment.member.firstName + " " + classEnrollment.member.lastName,
        "fitnessClass": classEnrollment.fitnessClass && classEnrollment.fitnessClass.name,
        "classSchedule": classEnrollment.classSchedule && classEnrollment.classSchedule.reference,
        "startDate": classEnrollment.startDate && classEnrollment.startDate.substring(0, 10),
        "endDate": classEnrollment.endDate && classEnrollment.endDate.substring(0, 10),
        "instructor": classEnrollment.classSchedule && classEnrollment.classSchedule.instructor && classEnrollment.classSchedule.instructor.name,
        "name": classEnrollment.member && classEnrollment.member.firstName + " " + classEnrollment.member.lastName,
        "email": classEnrollment.member && classEnrollment.member.email,
        "price": classEnrollment.price,
        "status": classEnrollment.status,
        "objectId": classEnrollment.id
    }));

    const listItems = classEnrollments.map((classEnrollment) => ({
        "id": classEnrollment.reference,
        "avatar": classEnrollment.member && classEnrollment.member.firstName.charAt(0) + classEnrollment.member.lastName.charAt(0),
        "title": classEnrollment.member && classEnrollment.member.firstName + " " + classEnrollment.member.lastName,
        "subtitle": classEnrollment.startDate + " - " + classEnrollment.endDate,
        "firstRow": [classEnrollment.fitnessClass && classEnrollment.fitnessClass.name, classEnrollment.price],
        "secondRow": [classEnrollment.status, ""],
        "objectId": classEnrollment.id
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} setSearch={setSearch} pageTitle="Class Enrollment" formUrl="/class-enrollment-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/class-enrollment-form"/>
        </div>
    );

}
