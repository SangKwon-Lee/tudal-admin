import { FC, useEffect, useState } from 'react';
import { APIHR } from 'src/lib/api';
import { IHR } from 'src/types/hiddenreport';
import HiddenReportDetailViewPresenter from './HiddenreportDetailView.Presenter';

interface HiddenReportDetailViewContainerProps {
  reportId: number;
}

const HiddenReportDetailViewContainer: React.FC<HiddenReportDetailViewContainerProps> =
  ({ reportId }) => {
    const [report, setReport] = useState<IHR>(null);

    useEffect(() => {
      async function getReport() {
        try {
          const { data, status } = await APIHR.get(reportId);
          if (status === 200) {
            setReport(data);
          }
        } catch (error) {
          console.log(error);
        }
      }

      getReport();
    }, [reportId]);

    return (
      report && <HiddenReportDetailViewPresenter state={report} />
    );
  };

export default HiddenReportDetailViewContainer;
