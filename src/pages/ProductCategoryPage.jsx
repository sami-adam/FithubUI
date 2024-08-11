import { useEffect } from "react";
import useProductCategoryStore from "../state/productCategoryState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function ProductCategoryPage() {
    const [productCategories, fetchProductCategories] = useProductCategoryStore((state) => [state.productCategories, state.fetchProductCategories]);

    useEffect(() => {
        fetchProductCategories();
    }, [fetchProductCategories]);

    const columns = [
        {"name": "id", "label": "ID", "width": 120},
        {"name": "name", "label": "Name", "sort": true},
        {"name": "benefits", "label": "Benefits"}
    ]

    const rows = productCategories.map((productCategory) => ({
        "id": productCategory.id,
        "name": productCategory.name,
        "benefits": productCategory.benefits.map(benefit => benefit.name).join(", "),
        "object": productCategory
    }));

    const listItems = productCategories.map((productCategory) => ({
        "id": productCategory.id,
        "avatar": productCategory.name.charAt(0),
        "title": productCategory.name,
        "subtitle": productCategory.description,
        "firstRow": [productCategory.id],
        "secondRow": [productCategory.description],
        "thirdRow": [""],
        "status": "NEW",
        "object": productCategory
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Product Categories" formUrl="/product-category-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/product-category-form"/>
        </div>
    );
}