const axios = require('axios');
const url = 'https://pomber.github.io/covid19/timeseries.json'

const traerDatos = async () => {
    return axios.get(url)
        .then(async (response: any) => {
            return response;
        })
        .catch((error: any) => {
            return { titulo: 'ERROR EN EL CONTROLLER', error };
        });
}

const lineColors = [{ confirmed: '#42A5F5', deaths: '#FFA726', recovered: '#66BB6A' },
{ confirmed: '#0900C0', deaths: '#A93D00', recovered: '#4EAB00' }]

const generateDataset = (data: any, labels: any, index: number, country?: string): any => {
    if (!country) {
        country = '';
    }else{
        country= `${country} - `;
    }
    let confirmedDataset: number[] = [];
    let deathsDataset: number[] = [];
    let recoveredDataset: number[] = [];
    let chartLabels: string[] = [];
    for (let record of data) {
        confirmedDataset.push(record.confirmed ? record.confirmed : 0);
        deathsDataset.push(record.deaths ? record.deaths : 0);
        recoveredDataset.push(record.recovered ? record.recovered : 0);
        chartLabels.push(record.date);
    }
    let yAxisNumber = index + 1;
    const dataToShow = {
        labels: chartLabels,
        datasets: [
            {
                label: country + labels.confirmed,
                data: confirmedDataset,
                fill: false,
                backgroundColor: lineColors[index].confirmed,
                borderColor: lineColors[index].confirmed,
                yAxisID: `y-axis-${yAxisNumber}`
            },
            {
                label: country + labels.deaths,
                data: deathsDataset,
                fill: false,
                backgroundColor: lineColors[index].deaths,
                borderColor: lineColors[index].deaths,
                yAxisID: `y-axis-${yAxisNumber}`
            },
            {
                label: country + labels.recovered,
                data: recoveredDataset,
                fill: false,
                backgroundColor: lineColors[index].recovered,
                borderColor: lineColors[index].recovered,
                yAxisID: `y-axis-${yAxisNumber}`
            }
        ]
    };
    return dataToShow;
}

export { traerDatos, generateDataset }