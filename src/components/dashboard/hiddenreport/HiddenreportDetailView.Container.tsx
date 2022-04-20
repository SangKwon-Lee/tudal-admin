import { useEffect, useState } from 'react';
import { APIHR } from 'src/lib/api';
import { IHR } from 'src/types/hiddenreport';
import HiddenReportDetailViewPresenter from './HiddenreportDetailView.Presenter';
import useUserVerification from 'src/hooks/useUserVerification';
import useAuth from 'src/hooks/useAuth';
import toast from 'react-hot-toast';

interface HiddenReportDetailViewContainerProps {
  reportId: number;
}

const HiddenReportDetailViewContainer: React.FC<HiddenReportDetailViewContainerProps> =
  ({ reportId }) => {
    const { user } = useAuth();
    const [report, setReport] = useState<IHR>(null);
    useUserVerification(user?.masters[0].id, 'master');

    useEffect(() => {
      async function getReport() {
        try {
          const { data, status } = await APIHR.get(reportId);
          if (status === 200) {
            setReport(data);
            console.log(data);
          }
        } catch (error) {
          console.log(error);
        }
      }

      getReport();
    }, [reportId]);

    const writeComment = async (comment) => {
      const body = {
        comment,
        parentId: null,
        reportId: report.id,
        userId: user.id,
      };

      const { status } = await APIHR.postReportComment(body);

      if (status === 200) {
        toast.success('댓글 작성에 성공하였습니다');
      }
    };

    return (
      report && (
        <HiddenReportDetailViewPresenter
          state={report}
          writeComment={writeComment}
        />
      )
    );
  };

export default HiddenReportDetailViewContainer;
