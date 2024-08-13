import { useEffect } from "react";
import useJournalStore from "../state/journalState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";
export default function JournalPage() {
    const [journals, fetchJournals] = useJournalStore((state) => [state.journals, state.fetchJournals]);

    useEffect(() => {
        fetchJournals();
    }, [fetchJournals]);

    const columns = [
        { "name": "code", "label": "Code", "sort": true }, 
        { "name": "name", "label": "Name" },
        { "name": "type", "label": "Type" },
        { "name": "account", "label": "Account", "width":200 }
    ]

    const rows = journals.map((journal) => ({
        "id": journal.id,
        "name": journal.name,
        "code": journal.code,
        "type": journal.type,
        "account": journal.account && `${journal.account.code} - ${journal.account.name}`,
        "object": journal
    }));

    const listItems = journals.map((journal) => ({
        "id": journal.id,
        "avatar": journal.name.charAt(0),
        "title": journal.name,
        "subtitle": journal.code,
        "firstRow": [journal.type, journal.account && journal.account.name],
        "secondRow": [journal.account && journal.account.code, ""],
        "status": "NEW",
        "object": journal
    }));

    return (
        <div style={{ marginTop: "20px", paddingInlineStart: 8 }}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Journals" formUrl="/journal-form" />
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/journal-form" />
        </div>
    );
}