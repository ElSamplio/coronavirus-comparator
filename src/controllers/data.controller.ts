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

export { traerDatos }