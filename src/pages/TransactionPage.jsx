import { useEffect } from "react";
import useTransactionStore from "../state/transactionState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function TransactionPage() {
    const [transactions, fetchTransactions] = useTransactionStore((state) => [state.transactions, state.fetchTransactions]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const columns = [
        {"name": "id", "label": "ID", "width": 120, "sort": true},
        {"name": "journal", "label": "Journal"},
        {"name": "timestamp", "label": "Timestamp", "width": 200},
        {"name": "description", "label": "Description", "width": 300},
        {"name": "amount", "label": "Amount", "special": "amount"},
        {"name": "status", "label": "Status", "special": "status"}
    ]

    const rows = transactions.map((transaction) => ({
        "id": transaction.id,
        "journal": transaction.journal && transaction.journal.name,
        "timestamp": transaction.timestamp,
        "description": transaction.description,
        "amount": transaction.entries && transaction.entries.filter((entry) => entry.type === "DEBIT").map((entry) => entry.debit).reduce((a, b) => a + b, 0),
        "status": transaction.status,
        "object": transaction
    }));

    const listItems = transactions.map((transaction) => ({
        "id": transaction.id,
        "avatar": transaction.description.charAt(0),
        "title": transaction.description,
        "subtitle": transaction.timestamp,
        "firstRow": [transaction.status],
        "secondRow": [transaction.journal && transaction.journal.name],
        "status": "NEW",
        "object": transaction
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Transactions" formUrl="/transaction-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/transaction-form"/>
        </div>
    );
}