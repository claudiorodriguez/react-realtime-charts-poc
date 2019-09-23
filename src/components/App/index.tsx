import React, {useState, useEffect} from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import styles from './styles.css';

const MAX_DATA_ITEMS = 10;
const MAX_Y_VALUE = 1000;

export const App = () => {
  const [data, setData] = useState<number[]>([]);
  // TODO: fix height issues
  const chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      backgroundColor: 'transparent'
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        animation: false
      }
    },
    series: [
      {
        color: '#c7f0db',
        data,
        type: 'area'
      }
    ],
    title: {
      text: ''
    },
    xAxis: {
      softMax: 9,
      visible: false
    },
    yAxis: {
      ceiling: MAX_Y_VALUE,
      gridLineColor: '#8bbabb',
      labels: {
        style: {
          color: '#8bbabb'
        }
      },
      title: {
        text: null
      }
    }
  };

  useEffect(() => {
    const source = new EventSource('/api/stream');

    source.onmessage = (event) => {
      try {
        const parsedMessage: {value: string} = JSON.parse(event.data);

        setData((curData) => {
          const newData = [...curData, parseInt(parsedMessage.value, 10)];
          const offset = Math.max(newData.length - MAX_DATA_ITEMS, 0);

          return newData.slice(offset, offset + MAX_DATA_ITEMS);
        });
      } catch (error) {
        // Ignore errors
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Real time charts POC</h1>
      <div className={styles.app}>
        <div className={styles.chartWrapper}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
