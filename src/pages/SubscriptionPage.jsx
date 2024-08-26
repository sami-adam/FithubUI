import { useEffect, useState } from "react";
import DataTable from "../components/common/DataTable";
import useSubscriptionStore from "../state/subscriptionState";
import useProductStore from "../state/productState";
import DataList from "../components/common/DataList";
import { useLocation } from "react-router-dom";

export default function SubscriptionPage({ defaultSearch="" }) {
    const [subscriptions, fetchSubscriptions] = useSubscriptionStore((state) => [state.subscriptions, state.fetchSubscriptions]);
    const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);
    const searchSubscriptions = useSubscriptionStore((state) => state.searchSubscriptions);
    const exportExcel = useSubscriptionStore((state) => state.exportExcel);
    
    const location = useLocation();

    if (location.state && location.state.search) {
        defaultSearch = location.state.search;
    }
    const [search, setSearch] = useState(defaultSearch);
    useEffect(() => {
        if (search === "" && defaultSearch === "") {
            fetchSubscriptions();
        }
        if (search !== "") {
            searchSubscriptions(search);
        }
        fetchProducts();
    }, [fetchSubscriptions, fetchProducts, search, searchSubscriptions, defaultSearch]);
    const filters = [
        {"name": "status", "label": "Status", "type": "select", "placeholder": "Filter By Status", "options": ["NEW", "PAID", "ACTIVE", "EXPIRED", "CANCELLED"]},
        {"name": "subscriptionType", "label": "Subscription Type", "type": "select", "placeholder": "Filter By Subscription Type", "options": products.map((product) => product.name)},
    ]
    const columns = [
        {"name": "id", "label": "Reference", "width": 140},
        {"name": "identificationNumber", "label": "ID Number"},
        {"name": "member", "label": "Member", "special": "person", "width": 250},
        {"name": "startDate", "label": "Start Date"},
        {"name": "endDate", "label": "End Date"},
        {"name": "totalPrice", "label": "Total Price", "width": 100, "special": "amount"},
        {"name": "tax", "label": "Tax", "width": 90, "special": "amount"},
        {"name": "discount", "label": "Discount", "width": 90, "special": "amount"},
        {"name": "netAmount", "label": "Net Amount", "width": 90, "special": "amount"},
        {"name": "status", "label": "Status", "special": "status"},
    ]
    
    const rows = subscriptions.map((subscription) => ({
        //"id": subscription.id,
        "id": subscription.reference,
        "name": (subscription.member&&subscription.member.firstName) + " " + (subscription.member&&subscription.member.lastName),
        "member": subscription.member,
        "identificationNumber": subscription.member&&subscription.member.identificationNumber,
        "email": subscription.member&&subscription.member.email,
        "startDate": subscription.startDate,
        "endDate": subscription.endDate,
        "unitPrice": subscription.subscriptionUnitPrice,
        "quantity": subscription.subscriptionQty,
        "totalPrice": subscription.totalAmount,
        "tax": subscription.taxAmount,
        "discount": subscription.discountAmount,
        "netAmount": subscription.netAmount,
        "status": subscription.status,
        "objectId": subscription.id
    }));

    const listItems = subscriptions.map((subscription) => ({
        "id": subscription.reference,
        "avatar": (subscription.member&&subscription.member.firstName&&subscription.member.firstName.charAt(0)),
        "title": (subscription.member&&subscription.member.firstName) + " " + (subscription.member&&subscription.member.lastName),
        "subtitle": subscription.member&&subscription.member.email,
        "firstRow": [subscription.member&&subscription.member.identificationNumber, subscription.startDate],
        "secondRow": [subscription.endDate, ""],
        "thirdRow": [subscription.totalAmount, subscription.netAmount],
        "status": subscription.status,
        "objectId": subscription.id
    }));

    const handleExport = (subscriptionIds) => {
        console.log("Exporting", subscriptionIds);
        exportExcel(subscriptionIds);
    }
    
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={filters} pageTitle="Subscriptions" formUrl="/subscription-form" setSearch={setSearch} excelExport={handleExport}/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/subscription-form" setSearch={setSearch}/>
        </div>
    );
}