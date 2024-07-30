import { useEffect } from "react";
import useMemberStore from "../state/memberState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function MemberPage() {
    const [members, fetchMembers] = useMemberStore((state) => [state.members, state.fetchMembers]);
    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const columns = [
        {"name": "id", "label": "Identification Number", "width": 120},
        {"name": "name", "label": "Full Name", "sort": true},
        {"name": "email", "label": "Email"},
        {"name": "phone", "label": "Phone"},
        {"name": "gender", "label": "Gender", "width": 80},
        {"name": "status", "label": "Status", "special": "status"},
    ]


    const rows = members.map((member) => ({
        "id": member.identificationNumber,
        "firstName": member.firstName,
        "lastName": member.lastName,
        "name": member.firstName + " " + member.lastName,
        "email": member.email,
        "phone": member.phone,
        "gender": member.gender,
        "status": member.status,
    }));

    const listItems = members.map((member) => ({
        "id": member.identificationNumber,
        "avatar": member.firstName.charAt(0),
        "title": member.firstName + " " + member.lastName,
        "subtitle": member.email,
        "firstRow": [member.gender, member.identificationNumber],
        "status":"NEW",
    }));
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Members"/>
            <DataList i18nIsDynamicList={true} listItems={listItems}/>
        </div>
    );
}