import React from 'react';
import { Chart } from 'primereact/chart';
import { generateDataset } from '../controllers/data.controller';

const MergedGraphs: React.FC<{ graphsData: any[]; labels: any }> = ({ graphsData = [], labels = {} }) => {

    const xlabels = generateDataset(graphsData[0].data, labels, 0).labels;

    console.log('graphsData >> ', graphsData);

    const multiAxisData = {
        labels: xlabels,
        datasets: [...(generateDataset(graphsData[0].data, labels, 0, graphsData[0].country).datasets), ...(generateDataset(graphsData[1].data, labels, 1, graphsData[1].country).datasets)]
    };

    const multiAxisOptions = {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        scales: {
            yAxes: [{
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
            }, {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                gridLines: {
                    drawOnChartArea: false
                }
            }]
        },
        legend: {
            display: true,
            labels: {
                boxWidth: 20
            }
        }
    }

    return <>
        <div>
            <Chart type="line" data={multiAxisData} options={multiAxisOptions} />
        </div>
    </>
}

export default MergedGraphs;