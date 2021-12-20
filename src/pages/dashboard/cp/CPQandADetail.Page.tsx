import type { FC } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import QandADetailContainer from 'src/components/dashboard/cp/CpQandADetail.Container';
const CpMasterCreatePage: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { qId } = useParams();
  const { search } = useLocation();

  const { answer } = queryString.parse(search);

  return (
    <>
      <PageLayout
        dashboard="대시보드"
        mainTopic={'문의사항'}
        pageTitle={'문의사항'}
        pageTopRef={pageTopRef}
      >
        <QandADetailContainer
          qId={qId}
          fromAnswer={Boolean(answer)}
        />
      </PageLayout>
    </>
  );
};

export default CpMasterCreatePage;
