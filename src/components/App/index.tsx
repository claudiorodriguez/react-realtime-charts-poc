import React, {useState, useEffect} from 'react';

import {Chart} from '../Chart';

import styles from './styles.css';

const MAX_DATA_ITEMS = 100;
const MAX_Y_VALUE = 1000;

export const App = () => {
  const [data, setData] = useState<number[]>([]);

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

    return () => {
      source.close();
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Real time charts POC</h1>
      <div className={styles.app}>
        <div className={styles.chartWrapper}>
          <Chart data={data} maxX={MAX_DATA_ITEMS - 1} maxY={MAX_Y_VALUE} />
        </div>
      </div>
    </div>
  );
};
