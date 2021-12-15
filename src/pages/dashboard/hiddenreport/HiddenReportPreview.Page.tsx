import { FC, useEffect, useState } from 'react';
import HiddenReportViewerPresenter from 'src/components/dashboard/hiddenreport/HiddenreportViewer.Presenter';

interface IProps {
  title: string;
  nickname: string;
  contents: string;
}
const HiddenReportPreviewPage: FC<IProps> = ({
  title,
  nickname,
  contents,
}) => {
  return (
    <HiddenReportViewerPresenter
      title={title}
      nickname={nickname}
      contents={contents}
    />
  );
};

export default HiddenReportPreviewPage;
