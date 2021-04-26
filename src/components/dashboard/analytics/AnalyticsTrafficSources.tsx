import { useState } from 'react';
import type { FC } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Tooltip,
  Typography
} from '@material-ui/core';
import type { CardProps } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import InformationCircleIcon from '../../../icons/InformationCircle';

const data = {
  series: [
    {
      color: '#4CAF50',
      data: [
        3350,
        1840,
        2254,
        5780,
        9349,
        5241,
        2770,
        2051,
        3764,
        2385,
        5912,
        8323
      ],
      name: 'Organic'
    },
    {
      color: '#FF9800',
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
      name: 'Referral'
    },
    {
      color: '#F44336',
      data: [100, 122, 50, 300, 250, 400, 312, 200, 10, 60, 90, 400],
      name: 'Social Media'
    }
  ],
  xaxis: {
    dataPoints: [
      '01 Jan',
      '02 Jan',
      '03 Jan',
      '04 Jan',
      '05 Jan',
      '06 Jan',
      '07 Jan',
      '08 Jan',
      '09 Jan',
      '10 Jan',
      '11 Jan',
      '12 Jan'
    ]
  }
};

export type ApexStrokeType = 'smooth' | 'straight' | 'stepline' | ('smooth' | 'straight' | 'stepline')[]

const AnalyticsTrafficSources: FC<CardProps> = (props) => {
  const theme = useTheme();
  const [selectedSeries, setSelectedSeries] = useState([
    'Organic',
    'Referral',
    'Social Media'
  ]);

  const handleChange = (event, name: string) => {
    if (!event.target.checked) {
      setSelectedSeries(selectedSeries.filter((item) => item !== name));
    } else {
      setSelectedSeries([...selectedSeries, name]);
    }
  };

  const visibleSeries = data.series.filter((item) => selectedSeries.includes(item.name));

  const chart = {
    options: {
      chart: {
        background: 'transparent',
        stacked: false,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: visibleSeries.map((item) => item.color),
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: theme.palette.divider,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      legend: {
        show: false
      },
      markers: {
        hover: {
          size: undefined,
          sizeOffset: 2
        },
        radius: 2,
        shape: ['circle'],
        size: 4,
        strokeWidth: 0
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
        width: 3
      } as ApexStroke,
      theme: {
        mode: theme.palette.mode
      },
      tooltip: {
        theme: theme.palette.mode
      },
      xaxis: {
        axisBorder: {
          color: theme.palette.divider
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true
        },
        categories: data.xaxis.dataPoints,
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: [
        {
          axisBorder: {
            color: theme.palette.divider,
            show: true
          },
          axisTicks: {
            color: theme.palette.divider,
            show: true
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          }
        },
        {
          axisTicks: {
            color: theme.palette.divider,
            show: true
          },
          axisBorder: {
            color: theme.palette.divider,
            show: true
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          },
          opposite: true
        }
      ]
    },
    series: visibleSeries
  };

  return (
    <Card {...props}>
      <CardHeader
        disableTypography
        title={(
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Traffic Sources
            </Typography>
            <Tooltip title="Widget25 Source by channel">
              <InformationCircleIcon fontSize="small" />
            </Tooltip>
          </Box>
        )}
      />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          px: 2
        }}
      >
        {data.series.map((item) => (
          <Box
            key={item.name}
            sx={{
              alignItems: 'center',
              display: 'flex',
              mr: 2
            }}
          >
            <Checkbox
              checked={selectedSeries.some((visibleItem) => visibleItem === item.name)}
              color="primary"
              onChange={(event) => handleChange(event, item.name)}
            />
            <Box
              sx={{
                backgroundColor: item.color,
                borderRadius: '50%',
                height: 8,
                ml: 1,
                mr: 2,
                width: 8
              }}
            />
            <Typography
              color="textPrimary"
              variant="subtitle2"
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <Chart
        height="393"
        type="line"
        {...chart}
      />
    </Card>
  );
};

export default AnalyticsTrafficSources;
