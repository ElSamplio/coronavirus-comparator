import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Spinner } from 'primereact/spinner';
import { Calendar } from 'primereact/calendar';
import { DataView } from 'primereact/dataview';
import { Chart } from 'primereact/chart';
import { Toolbar } from 'primereact/toolbar';
import { labels_es, labels_en } from './const/labels';
import { languages } from './const/languages';
import { traerDatos } from './controllers/data.controller';

const moment = require('moment');

const App: React.FC = () => {

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [countryOpts, setCountryOpts] = useState<any[]>([]);
  const [language, setLanguage] = useState<string>(languages.es);
  const [labels, setLabels] = useState<any>(labels_es);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | Date[]>(new Date());
  const [dataSeries, setDataSeries] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    traerDatos().then((datos) => {
      setData(datos.data);
      let options: any[] = [];
      Object.keys(datos.data).forEach((opt) => {
        options.push({
          label: opt,
          value: opt
        })
      });
      setCountryOpts(options);
    }).catch((err) => {
      console.log(err);
    }).finally(() => setLoading(false));
  }, [])

  useEffect(() => {
    switch (language) {
      case languages.es:
        setLabels(labels_es);
        break;
      case languages.en:
        setLabels(labels_en);
        break;
      default:
        setLabels(labels_es);
        break;
    }
  }, [language])

  const switchLanguage = () => {
    switch (language) {
      case languages.es:
        setLanguage(languages.en);
        break;
      case languages.en:
        setLanguage(languages.es);
        break;
      default:
        setLanguage(languages.es);
        break;
    }
  }

  const filterData = () => {
    let selectedData: any[] = data[selectedCountry];
    if (selectedData) {
      let endDate = new Date(selectedDate.toString());
      let results: any[] = [];
      for (let i = 0; i < selectedDays; i++) {
        let current = new Date();
        current.setTime(endDate.getTime());
        current.setDate(current.getDate() + i);
        let currentStr = moment(current).format('YYYY-M-D')
        const result = selectedData.filter((elem) => elem.date === currentStr);
        if (result && result.length > 0) {
          results.push(result[0]);
        }
      }
      let objData = {
        country: selectedCountry,
        fromDate: selectedDate,
        days: selectedDays,
        data: results,
      }
      let series = [...dataSeries];
      series.push(objData)
      setDataSeries(series);
    }
  }

  const restart = () => {
    setSelectedCountry('');
    setSelectedDays(1);
    setSelectedDate(new Date());
    setDataSeries([]);
  }

  const itemTemplate = (record: any) => {
    return <div style={{ padding: '.5em' }} className="p-col-12 p-md-4 p-lg-4">
      <div className='p-grid'>
        <div className='p-col-12 p-md-12 p-lg-12'>
          <Toolbar>
            <div className="p-toolbar-group-left">
              {record.country}
            </div>
            <div className="p-toolbar-group-right">
              <Button icon="pi pi-times"
                onClick={() => removeItem(record)} />
            </div>
          </Toolbar>
        </div>
        <div className='p-col-12 p-md-2 p-lg-3'>
          {labels.dateFrom}
        </div>
        <div className='p-col-12 p-md-3 p-lg-3'>
          {moment(record.fromDate).format('YYYY-M-D')}
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
  }

  const generateChart = (data: any) => {
    let confirmedDataset: number[] = [];
    let deathsDataset: number[] = [];
    let recoveredDataset: number[] = [];
    let chartLabels: string[] = [];
    let dayNumber = 1;
    for (let record of data) {
      confirmedDataset.push(record.confirmed ? record.confirmed : 0);
      deathsDataset.push(record.deaths ? record.deaths : 0);
      recoveredDataset.push(record.recovered ? record.recovered : 0);
      chartLabels.push(record.date);
      dayNumber++;
    }
    const dataToShow = {
      labels: chartLabels,
      datasets: [
        {
          label: labels.confirmed,
          data: confirmedDataset,
          fill: false,
          backgroundColor: '#42A5F5',
          borderColor: '#42A5F5'
        },
        {
          label: labels.deaths,
          data: deathsDataset,
          fill: false,
          backgroundColor: '#66BB6A',
          borderColor: '#66BB6A'
        },
        {
          label: labels.recovered,
          data: recoveredDataset,
          fill: false,
          backgroundColor: '#FFA726',
          borderColor: '#FFA726'
        }
      ]
    };
    return <Chart type="line" data={dataToShow} />
  }

  const removeItem = (item: any) => {
    let seriesCopy = [...dataSeries];
    let foundIndex = seriesCopy.findIndex((elem) => elem === item);
    if (foundIndex >= 0) {
      seriesCopy.splice(foundIndex, 1);
      setDataSeries(seriesCopy);
    }
  }

  return (

    <div className='p-grid'>
      <Dialog modal={true} visible={loading}
        onHide={() => setLoading(false)}
        closable={false}>
        <ProgressSpinner />
      </Dialog>
      <div className='p-col-12 p-md-3 p-lg-3 App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </div>
      <div className='p-col-8 p-md-8 p-lg-8 App-header'>
        {labels.headerTitle}
      </div>
      <div className='p-col-4 p-md-1 p-lg-1 App-header'>
        <Button icon='fa fa-globe' style={{ fontSize: 18 }}
          label={language} onClick={switchLanguage} />
      </div>
      <div className='p-col-12 p-md-1 p-lg-1'>
        {labels.country}
      </div>
      <div className='p-col-12 p-md-3 p-lg-3'>
        <Dropdown value={selectedCountry}
          options={countryOpts}
          onChange={(e) => { setSelectedCountry(e.value) }}
          filter={true}
          style={{ width: '100%' }}
          filterPlaceholder={labels.countryPlaceholder}
          filterBy='label,value' placeholder={labels.countryPlaceholder} />
      </div>
      <div className='p-col-12 p-md-1 p-lg-1'>
        {labels.days}
      </div>
      <div className='p-col-12 p-md-3 p-lg-3'>
        <Spinner value={selectedDays}
          onChange={(e) => setSelectedDays(e.value)} min={1} max={30} />
      </div>
      <div className='p-col-12 p-md-1 p-lg-1'>
        {labels.dateFrom}
      </div>
      <div className='p-col-12 p-md-3 p-lg-3'>
        <Calendar locale={labels.calendar} dateFormat='dd/mm/yy'
          value={selectedDate} onChange={(e) => setSelectedDate(e.value)}
          minDate={new Date('2020-01-22')}
          maxDate={new Date()}></Calendar>
      </div>
      <div className='p-col-12 p-md-3 p-lg-3' />
      <div className='p-col-12 p-md-3 p-lg-3'>
        <Button label={labels.showData} style={{ width: '90%', marginLeft: '5%', marginRight: '5%' }}
          onClick={filterData} />
      </div>
      <div className='p-col-12 p-md-3 p-lg-3'>
        <Button label={labels.reset} style={{ width: '90%', marginLeft: '5%', marginRight: '5%' }}
          onClick={restart} />
      </div>
      <div className='p-col-12 p-md-3 p-lg-3' />
      <div className='p-col-12 p-md-12 p-lg-12'>
        <DataView value={dataSeries} layout='grid' itemTemplate={itemTemplate} />
      </div>
    </div>
  );
}

export default App;
