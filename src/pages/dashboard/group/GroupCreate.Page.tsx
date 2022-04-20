import React from 'react';
import GroupCreateContainer from 'src/components/dashboard/group/GroupCreate.Container';
import PageLayout from 'src/components/layout/ListPageLayout';
import { useParams, useLocation } from 'react-router-dom';

const HiddenReportListPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const { groupId } = useParams();
  const path = useLocation();
  const isCreate = path.pathname.includes('create');

  const mode = isCreate ? 'create' : 'edit';

  return (
    <PageLayout
      mainTopic={'데일리 생성'}
      pageTitle={'데일리 생성'}
      pageTopRef={pageTopRef}
      hasCreateButton={false}
    >
      <GroupCreateContainer
        mode={mode}
        pageTopRef={pageTopRef}
        groupId={parseInt(groupId, 10)}
      />
    </PageLayout>
  );
};

export default HiddenReportListPage;
