import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import type { TagData } from '../../types/todaykeyword';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import TreeMap from 'fusioncharts/fusioncharts.treemap';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionCharts.options['license']({
  key: 'cgB1kvdF5H2E4F1C5B1A3A1A1D4G4I3xkcA3D5trxfsA2B2jE-11oE1G4E1A2B6C4A3F4B2C1C3H2C1C8B7B5E-11acE3E3G2sA4B2C2feI-8D1H4B3zD-13mD1D3G4nvrB9D2C6E2C4B1I4F1A9C11A5uD-11C-9A2I3NC5qD-17jD2FH3H1F-7B-22tC8B2E6D2E2F2J2C10A2B3D6C1D1D3r==',
  creditLabel: false,
});

ReactFC.fcRoot(FusionCharts, TreeMap, FusionTheme);

interface Props {
  data: TagData[];
  width: number;
  height: number;
}

const TodayKeywordChart: FC<Props> = (props) => {
  const { data, width, height } = props;
  const [dataSource, setDataSource] = useState({});

  useEffect(() => {
    if (data.length < 1) return;

    let min = data[0].svalue;
    let max = data[0].svalue;

    // eslint-disable-next-line array-callback-return
    data.map((item) => {
      if (min > item.svalue) {
        min = item.svalue;
      }
      if (max < item.svalue) {
        max = item.svalue;
      }
    });

    setDataSource({
      chart: {
        hideTitle: '1',
        caption: '',
        algorithm: 'squarified',
        plottooltext: '<b>$label(+$svalue)</b>',
        theme: 'fusion',
        showPrintMenuItem: 0,
        showChildLabels: 1,
        chartTopMargin: -20,
        plotborderthickness: '.5',
        plotbordercolor: 'ffffff',
        horizontalPadding: 0,
        verticalPadding: 0,
        verticalMargin: 0,
        showHoverEffect: 0,
        showTooltip: 0,
        showParent: 0,
        labelFontBold: 1,
        labelFontColor: 'ffffff',
        labelGlow: 0,
        labelFontSize: width < 400 ? '12' : '14',
      },
      data: [
        {
          data,
        },
      ],
      colorrange: {
        color: [
          {
            code: 'FFE9EC',
            maxvalue: min,
          },
          {
            code: 'FF9F43',
            maxvalue: max,
          },
        ],
      },
    });
  }, [data, width]);

  return (
    <Box sx={{ py: 1, px: 0, backgroundColor: 'white' }}>
      <ReactFC
        type={'treemap'}
        width={width}
        height={height}
        dataFormat={'json'}
        dataSource={dataSource}
        events={{
          dataPlotClick: (eventObj, dataObj) => {
            window.open('http://app.tudal.co.kr', '_blank');
          },
        }}
      />
    </Box>
  );
};

export default TodayKeywordChart;
