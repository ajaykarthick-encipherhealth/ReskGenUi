
import React, { useState } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import Style from './style.module.css'

const SelectionDemo = () => {
    const [selection, setSelection] = useState([]);
    const [data] = useState([
        {
            expanded: true,
            type: 'person',
            className: `${Style.orgCard}`,
            style: { borderRadius: '7px', padding: "10px", border: "2px solid success" },
            data: {
                image: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Amy Elsner',
                title: 'HTN Heart and CKD With HF and Stage 5 or ESRD'
            },
            children: [
                {
                    expanded: true,
                    type: 'person',
                    className: `${Style.orgCard}`,
                    style: { borderRadius: '7px', padding: "10px 20px", padding: "10px 20px" },
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                        name: 'Anna Fali',
                        title: 'CMO'
                    },
                    children: [
                        {
                            label: 'Sales',
                            className: `${Style.orgCard}`,
                            style: { borderRadius: '7px', padding: "10px 20px" }
                        },
                        {
                            label: 'Marketing',
                            className: `${Style.orgCard}`,
                            style: { borderRadius: '7px', padding: "10px 20px" }
                        }
                    ]
                },
                {
                    expanded: true,
                    type: 'person',
                    className: `${Style.orgCard}`,
                    style: { borderRadius: '7px', padding: "10px 20px" },
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png',
                        name: 'Stephen Shaw',
                        title: 'CTO'
                    },
                    children: [
                        {
                            label: 'Development',
                            className: `${Style.orgCard}`,
                            style: { borderRadius: '7px', padding: "10px 20px" }
                        },
                        {
                            label: 'UI/UX Design',
                            className: `${Style.orgCard}`,
                            style: { borderRadius: '7px', padding: "10px 20px" }
                        }
                    ]
                }
            ]
        }
    ]);

    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div className="">
                    <div className="">
                        <div className={Style.code}>{node.data.name}</div>
                        <div className={Style.code}>{node.data.title}</div>
                    </div>
                </div>
            );
        }

        return node.label;
    };

    return (
        <div className="card border border-primary overflow-x-auto">
            <OrganizationChart value={data} selectionMode="multiple" selection={selection} onSelectionChange={(e) => setSelection(e.data)} nodeTemplate={nodeTemplate} />
        </div>
    )
}
export default SelectionDemo;
        