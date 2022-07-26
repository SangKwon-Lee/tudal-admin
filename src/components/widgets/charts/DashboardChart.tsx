import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

// * DashboardChart는 대쉬보드에서 데이터를 라인 그래프 형식으로 표시할 때 사용하는 커스텀 컴포넌트이며
// * Chart2.tsx를 참고하여 제작. Variation으로 DashboardChart2가 있으며 이 차트는 두개의 데이터를 동시에
// * 표기할 때 사용한다.

interface IDashboardChart {
  DB: [];
  dates: [];
  dataName: string;
}

export const DashboardChart: FC<IDashboardChart> = (props) => {
  const { DB, dates, dataName } = props;
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
        datetimeFormatter: {},
      },
    },
    yaxis: [
      {
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
      data: DB,
      name: dataName,
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
