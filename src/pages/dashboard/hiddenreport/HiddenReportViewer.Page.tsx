import { FC, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import crypto from 'crypto';
import { useNavigate, useParams } from 'react-router';
import { IHR } from 'src/types/hiddenreport';
import { cmsServer, CMS_TOKEN } from 'src/lib/axios';
import useMounted from 'src/hooks/useMounted';
import HiddenreportViewerPresenter from 'src/components/dashboard/hiddenreport/HiddenreportViewer.Presenter';

const HiddenReportViewerPage: FC = () => {
  const [report, setReport] = useState<IHR>(null);
  const { id } = useParams();
  const mounted = useMounted();

  const navigate = useNavigate();
  useEffect(() => {
    const getReport = async () => {
      const { data } = await cmsServer.get<IHR>(
        `/hidden-reports/${id}?token=${CMS_TOKEN}`,
      );
      setReport(data);
    };

    getReport();
  }, [id]);

  useEffect(() => {
    if (mounted && report) {
      const randomString = crypto.randomBytes(20).toString('hex');

      navigate(
        `/viewer/hiddenreport/${report.id}?key=${randomString}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  if (!report) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard: Hiddenbox Viewer | TUDAL Admin</title>
      </Helmet>
      <HiddenreportViewerPresenter
        title={report.title}
        contents={report.contents}
        nickname={report.hidden_reporter?.nickname}
      />
    </>
  );
};

export default HiddenReportViewerPage;
