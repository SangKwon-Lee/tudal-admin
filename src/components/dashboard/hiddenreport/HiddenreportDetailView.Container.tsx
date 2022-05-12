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
    const [reportUsers, setReportUsers] = useState([]);
    useUserVerification(user?.masters[0].id, 'master');

    const getHiddenReportUsers = async () => {
      try {
        const { data } = await APIHR.getHiddenReportUsers(reportId);
        setReportUsers(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
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
      getHiddenReportUsers();
      getReport();
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          reportUsers={reportUsers}
        />
      )
    );
  };

export default HiddenReportDetailViewContainer;
