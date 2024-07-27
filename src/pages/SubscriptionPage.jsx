import { useEffect } from "react";
import DataTable from "../components/common/DataTable";
import useSubscriptionStore from "../state/subscriptionState";
import useProductStore from "../state/productState";
import DataList from "../components/common/DataList";

export default function SubscriptionPage() {
    const [subscriptions, fetchSubscriptions] = useSubscriptionStore((state) => [state.subscriptions, state.fetchSubscriptions]);
    const [products, fetchProducts] = useProductStore((state) => [state.products, state.fetchProducts]);
    useEffect(() => {
        fetchSubscriptions();
        fetchProducts();
    }, [fetchSubscriptions, fetchProducts]);
    const filters = [
        {"name": "status", "label": "Status", "type": "select", "placeholder": "Filter By Status", "options": ["NEW", "PAID", "ACTIVE", "EXPIRED", "CANCELLED"]},
        {"name": "subscriptionType", "label": "Subscription Type", "type": "select", "placeholder": "Filter By Subscription Type", "options": products.map((product) => product.name)},
    ]
    const columns = [
        {"name": "id", "label": "Reference", "width": 85},
        {"name": "identificationNumber", "label": "Identification Number"},
        {"name": "member", "label": "Member", "special": "person", "width": 150},
        {"name": "startDate", "label": "Start Date"},
        {"name": "endDate", "label": "End Date"},
        {"name": "totalPrice", "label": "Total Price", "width": 80},
        {"name": "tax", "label": "Tax", "width": 50},
        {"name": "discount", "label": "Discount", "width": 80},
        {"name": "netAmount", "label": "Net Amount", "width": 80},
        {"name": "status", "label": "Status", "special": "status"},
    ]
    if (subscriptions.length === 0) {
        return <div>Loading...</div>;
    }
    console.log("Subscriptios",subscriptions)
    const rows = subscriptions.map((subscription) => ({
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
    }));

    const listItems = subscriptions.map((subscription) => ({
        "id": subscription.reference,
        "avatar": (subscription.member&&subscription.member.firstName.charAt(0)),
        "title": (subscription.member&&subscription.member.firstName) + " " + (subscription.member&&subscription.member.lastName),
        "subtitle": subscription.member&&subscription.member.email,
        "firstRow": [subscription.member&&subscription.member.identificationNumber, subscription.startDate],
        "secondRow": [subscription.endDate, ""],
        "thirdRow": [subscription.totalAmount, subscription.netAmount],
        "status": subscription.status,
    }));
    
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={filters} pageTitle="Subscriptions"/>
            <DataList i18nIsDynamicList={true} listItems={listItems}/>
        </div>
    );
}