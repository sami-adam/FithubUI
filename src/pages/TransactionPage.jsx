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
        {"name": "timestamp", "label": "Timestamp"},
        {"name": "description", "label": "Description"},
        {"name": "status", "label": "Status"},
    ]

    const rows = transactions.map((transaction) => ({
        "id": transaction.id,
        "timestamp": transaction.timestamp,
        "description": transaction.description,
        "status": transaction.status,
        "object": transaction
    }));

    const listItems = transactions.map((transaction) => ({
        "id": transaction.id,
        "avatar": transaction.description.charAt(0),
        "title": transaction.description,
        "subtitle": transaction.timestamp,
        "firstRow": [transaction.status],
        "secondRow": [transaction.id],
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