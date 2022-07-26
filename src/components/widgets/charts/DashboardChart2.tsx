import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

// * Dashboard 차트는 표기할 수 있는 데이터가 하나이고 Dashboard2는 이름에서 유추할 수 있듯이
// * 2개의 데이터를 동시에 표시할 수 있는 차트이다. 숫자에 알맞은 데이터와 이름을 표기하면 된다.

interface IDashboardChart2 {
  DB1: [];
  DB2: [];
  dates: [];
  dataName1: string;
  dataName2: string;
}

export const DashboardChart2: FC<IDashboardChart2> = (props) => {
  const { DB1, DB2, dates, dataName1, dataName2 } = props;
  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#1f87e6', '#ff5c7c'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: 'white',
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      horizontalAlign: 'right',
      labels: {
        colors: 'white',
      },
      position: 'top',
      show: true,
    },
    markers: {
      hover: {
        size: undefined,
        sizeOffset: 2,
      },
      radius: 2,
      shape: 'circle',
      size: 4,
      strokeColors: ['#1f87e6', '#27c6db'],
      strokeWidth: 0,
    },
    stroke: {
      curve: 'smooth',
      dashArray: [0, 3],
      lineCap: 'butt',
      width: 3,
    },
    theme: {
      mode: 'dark',
    },
    xaxis: {
      decimalsInFloat: 0,
      axisBorder: {
        color: 'white',
      },
      axisTicks: {
        color: 'white',
        show: true,
      },
      categories: dates,
      labels: {
        style: {
          colors: 'white',
        },
      },
    },
    yaxis: [
      {
        decimalsInFloat: 0,
        axisBorder: {
          color: 'white',
          show: true,
        },
        axisTicks: {
          color: 'white',
          show: true,
        },
        labels: {
          style: {
            colors: 'white',
          },
        },
      },
    ],
  };

  const chartSeries = [
    {
      data: DB1,
      name: dataName1,
    },
    {
      data: DB2,
      name: dataName2,
    },
  ];

  return (
    <Chart
      height="200px"
      options={chartOptions}
      series={chartSeries}
      type="line"
    />
  );
};
