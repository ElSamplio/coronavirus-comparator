import React from 'react';

import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { generateDataset } from '../controllers/data.controller';

const moment = require('moment');

const GraphItem: React.FC<{
    record: any;
    itemsToMerge: any[];
    labels: any;
    checkItem(checked: any, record: any): void;
    removeItem(record: any): void;
    showMergedGraphs(): void;
}> = ({
    record = {},
    itemsToMerge = [],
    labels = {},
    checkItem = (checked: any, record: any) => { },
    removeItem = (record: any) => { },
    showMergedGraphs = () => { }
}) => {

        const chartOptions = {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            scales: {
                yAxes: [{
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-1',
                }]
            }
        }

        const generateChart = (data: any) => {
            let dataToShow: any = generateDataset(data, labels, 0);
            return <Chart type="line" data={dataToShow} options={chartOptions} />
        }

        return <>
            <div style={{ padding: '.5em' }} className="p-col-12 p-md-4 p-lg-4">
                <div className='p-grid'>
                    <div className='p-col-12 p-md-12 p-lg-12'>
                        <Toolbar>
                            {record.country}
                            <div className="p-toolbar-group-right">
                                {
                                    itemsToMerge.length === 2 && itemsToMerge.includes(record) ?
                                        <Button icon="fa exchange-alt"
                                            style={{ marginLeft: 10, marginRight: 10 }}
                                            tooltip={labels.mergeTooltip}
                                            onClick={() => showMergedGraphs()} />
                                        : ''
                                }
                                {labels.merge}
                                <Checkbox style={{ marginLeft: 5, marginRight: 15 }}
                                    checked={itemsToMerge.includes(record)}
                                    onChange={e => checkItem(e.checked, record)} />
                                <Button icon="pi pi-times"
                                    onClick={() => removeItem(record)} />
                            </div>
                        </Toolbar>
                    </div>
                    <div className='p-col-12 p-md-2 p-lg-3'>
                        {record.intervalType === 0 ? labels.dateFrom : labels.initialCases}
                    </div>
                    <div className='p-col-12 p-md-3 p-lg-3'>
                        {record.intervalType === 0 ? moment(record.fromDate).format('YYYY-M-D') : record.initialCasesNumber}
                    </div>
                    <div className='p-col-12 p-md-2 p-lg-3'>
                        {labels.days}
                    </div>
                    <div className='p-col-12 p-md-3 p-lg-3'>
                        {record.days}
                    </div>
                    <div className='p-col-12 p-md-12 p-lg-12'>
                        {generateChart(record.data)}
                    </div>
                </div>
            </div >
        </>
    }

export default GraphItem;