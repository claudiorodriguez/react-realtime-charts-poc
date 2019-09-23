import React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ChartProps {
  data: number[];
  maxY: number;
  maxX: number;
}

export const Chart = ({data, maxX, maxY}: ChartProps) => {
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
      softMax: maxX,
      visible: false
    },
    yAxis: {
      ceiling: maxY,
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

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};
