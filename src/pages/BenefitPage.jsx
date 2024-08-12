import { useEffect } from "react";
import useBenefitStore from "../state/benefitState";
import DataTable from "../components/common/DataTable";
import DataList from "../components/common/DataList";

export default function BenefitPage() {
    const [benefits, fetchBenefits] = useBenefitStore((state) => [state.benefits, state.fetchBenefits]);

    useEffect(() => {
        fetchBenefits();
    }, [fetchBenefits]);

    const columns = [
        {"name": "id", "label": "ID", "width": 120},
        {"name": "name", "label": "Name", "sort": true, "width": 180},
        {"name": "description", "label": "Description", "width": 300},
    ]

    const rows = benefits.map((benefit) => ({
        "id": benefit.id,
        "name": benefit.name,
        "description": benefit.description,
        "object": benefit
    }));

    const listItems = benefits.map((benefit) => ({
        "id": benefit.id,
        "avatar": benefit.name.charAt(0),
        "title": benefit.name,
        "subtitle": benefit.description,
        "firstRow": [benefit.description, ""],
        "secondRow": ["", ""],
        "thirdRow": ["", ""],
        "status": "NEW",
        "object": benefit
    }));

    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <DataTable columns={columns} rows={rows} selectionFilters={[]} pageTitle="Benefits" formUrl="/benefit-form"/>
            <DataList i18nIsDynamicList={true} listItems={listItems} formUrl="/benefit-form"/>
        </div>
    );
}