import { FC, useEffect, useState } from 'react';
import { APIHR } from 'src/lib/api';
import { IHR } from 'src/types/hiddenreport';
import HiddenReportDetailViewPresenter from './HiddenreportDetailView.Presenter';
import useUserVerification from 'src/hooks/useUserVerification';

interface HiddenReportDetailViewContainerProps {
  reportId: number;
}

const HiddenReportDetailViewContainer: React.FC<HiddenReportDetailViewContainerProps> =
  ({ reportId }) => {
    const [report, setReport] = useState<IHR>(null);
    useUserVerification(report?.hidden_reporter.id, 'hiddenReporter');

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
