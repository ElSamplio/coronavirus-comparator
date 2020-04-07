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
import { RadioButton } from 'primereact/radiobutton';
import { labels_es, labels_en } from './const/labels';
import { languages } from './const/languages';
import { traerDatos } from './controllers/data.controller';
import GraphItem from './components/GraphItem';
import MergedGraphs from './components/MergedGraphs';

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
  const [itemsToMerge, setItemsToMerge] = useState<any[]>([]);
  const [intervalType, setIntervalType] = useState<number>(0);
  const [numberOfCases, setNumberOfCases] = useState<number>(0);
  const [comparatorVisible, setComparatorVisible] = useState<boolean>(false);

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
      switch (intervalType) {
        case 0:
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
          break;
        case 1:
          let result: any[] = selectedData.filter((elem) => elem.confirmed >= numberOfCases);
          result = result.slice(0, selectedDays);
          results.push(...result);
          break;
        default:
          break;
      }
      let objData = {
        country: selectedCountry,
        intervalType,
        fromDate: selectedDate,
        initialCasesNumber: numberOfCases,
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
    setItemsToMerge([]);
    setIntervalType(0);
    setNumberOfCases(0);
    setComparatorVisible(false);
  }

  const itemTemplate = (record: any) => {
    return <GraphItem labels={labels}
      record={record}
      itemsToMerge={itemsToMerge}
      checkItem={checkItem}
      removeItem={removeItem}
      showMergedGraphs={showMergedGraphs} />;
  }

  const showMergedGraphs = () => {
    setComparatorVisible(true);
  }

  const removeItem = (item: any) => {
    let seriesCopy = [...dataSeries];
    let foundIndex = seriesCopy.findIndex((elem) => elem === item);
    if (foundIndex >= 0) {
      seriesCopy.splice(foundIndex, 1);
      if (itemsToMerge.includes(item)) {
        let items = [...itemsToMerge];
        let foundIndexMerge = items.findIndex((elem) => elem === item);
        if (foundIndexMerge >= 0) {
          items.splice(foundIndexMerge, 1);
        }
        setItemsToMerge(items);
      }
      setDataSeries(seriesCopy);
    }
  }

  const checkItem = (checked: boolean, item: any) => {
    let items = [...itemsToMerge];
    if (checked) {
      items.push(item);
    } else {
      let foundIndex = items.findIndex((elem) => elem === item);
      if (foundIndex >= 0) {
        items.splice(foundIndex, 1);
      }
    }
    setItemsToMerge(items);
  }

  return (

    <div className='p-grid'>
      <Dialog modal={true} visible={loading}
        onHide={() => setLoading(false)}
        closable={false}>
        <ProgressSpinner />
      </Dialog>
      <Dialog modal={true} visible={comparatorVisible}
        onHide={() => setComparatorVisible(false)}
        closable={true} maximized={true} maximizable={true}>
        <MergedGraphs graphsData={itemsToMerge} labels={labels} />
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
          onChange={(e) => setSelectedDays(e.value)} min={1} max={150} />
      </div>
      <div className='p-col-12 p-md-1 p-lg-1'>
        {labels.initialCriteria}
      </div>
      <div className='p-col-12 p-md-3 p-lg-3'>
        <div className='p-col-12'>
          <RadioButton inputId="rb1" name="type"
            value={0} onChange={(e) => {
              setIntervalType(e.value);
              setNumberOfCases(0);
            }}
            checked={intervalType === 0} />
          <label htmlFor="rb1" className="p-radiobutton-label">{labels.initialDate}</label>
        </div>
        <div className='p-col-12'>
          <RadioButton inputId="rb2" name="type"
            value={1} onChange={(e) => {
              setIntervalType(e.value);
              setSelectedDate(new Date());
            }}
            checked={intervalType === 1} />
          <label htmlFor="rb2" className="p-radiobutton-label">{labels.initialCases}</label>
        </div>
      </div>
      <div className='p-col-12 p-md-1 p-lg-1'>
        {intervalType === 0 ? labels.dateFrom : labels.initialCases}
      </div>
      <div className='p-col-12 p-md-3 p-lg-3'>
        {
          intervalType === 0 ?
            <Calendar locale={labels.calendar} dateFormat='dd/mm/yy'
              style={{ width: '100%' }} inputStyle={{ width: '100%' }}
              value={selectedDate} onChange={(e) => setSelectedDate(e.value)}
              minDate={new Date('2020-01-22')}
              maxDate={new Date()}></Calendar>
            :
            <Spinner value={numberOfCases}
              onChange={(e) => setNumberOfCases(e.value)} min={1} />
        }

      </div>
      <div className='p-col-12 p-md-4 p-lg-4'>
        <Button label={labels.showData} style={{ width: '80%', marginLeft: '10%', marginRight: '10%' }}
          onClick={filterData} />
      </div>
      <div className='p-col-12 p-md-4 p-lg-4'>
        <Button label={labels.reset} style={{ width: '80%', marginLeft: '10%', marginRight: '10%' }}
          onClick={restart} />
      </div>
      <div className='p-col-12 p-md-12 p-lg-12'>
        <DataView value={dataSeries} layout='grid' itemTemplate={itemTemplate} />
      </div>
    </div>
  );
}

export default App;
