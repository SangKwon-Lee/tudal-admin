import type { FC } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import HankyungListContainer from 'src/components/dashboard/hankyung/list/HankyungList.Container';
import PageLayout from 'src/components/layout/ListPageLayout';

const Overview: FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { contentsId } = useParams();
  const mode = contentsId ? 'edit' : 'create';
  return (
    <>
      <PageLayout
        dashboard={'한경'}
        mainTopic={'한경 리스트'}
        pageTitle={'한경 리스트'}
        pageTopRef={pageTopRef}
        hasCreateButton={false}
        buttonClickLink={'/dashboard/tudalus/contents/create'}
        buttonName="생성"
      >
        <HankyungListContainer />
      </PageLayout>
    </>
  );
};

export default Overview;
