import { useEffect } from "react";
import useEmailStore from "../state/emailState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
import { CircularProgress } from "@mui/joy";

export default function EmailPage() {
    const [emails, fetchEmails] = useEmailStore((state) => [state.emails, state.fetchEmails]);
    useEffect(() => {
        fetchEmails();
    }, [fetchEmails]);

    const columns = [
        {"name": "id", "label": "ID", "width": 80},
        {"name": "subject", "label": "Subject", "sort": true},
        {"name": "emailFrom", "label": "From", "width": 150},
        {"name": "emailTo", "label": "To", "width": 150},
        {"name": "scheduledDate", "label": "Scheduled Date", "width": 150},
        {"name": "status", "label": "Status", "special": "status"},
    ]

    if (emails.length === 0) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems : "center"}}><CircularProgress /></div>;
    }

    const rows = emails.map((email) => ({
        "id": "EM"+`${email.id}`.padStart(6, "0"),
        "subject": email.subject.substring(0, 30) + (email.subject.length > 30 ? "..." : ""),
        "emailFrom": email.emailFrom,
        "emailTo": email.emailTo,
        "scheduledDate": email.scheduledDate,
        "status": email.status,
    }));

    const listItems = emails.map((email) => ({
        "id": email.id,
        "avatar": email.emailFrom.charAt(0),
        "title": email.subject,
        "subtitle": email.emailTo,
        "firstRow": [email.emailFrom, email.scheduledDate],
        "status": email.status,
    }));
    return (
        <div style={{marginTop:"20px", paddingInlineStart:100}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Emails"/>
            <DataList i18nIsDynamicList={true} listItems={listItems}/>
        </div>
    );
}