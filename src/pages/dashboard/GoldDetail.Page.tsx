import React, { useState } from 'react';
import PageLayout from 'src/components/layout/ListPageLayout';
import { useParams } from 'react-router';
import GoldDetailContainer from 'src/components/dashboard/gold/GoldDetail.Container';

const GoldDetailPage: React.FC = () => {
  const pageTopRef = React.useRef<HTMLDivElement>(null);
  const params = useParams();
  const [userId, setUser] = useState<number>(
    parseInt(params.userId) ? parseInt(params.userId) : null,
  );

  const handleUser = (id) => {
    setUser(id);
  };
  return (
    <PageLayout
      mainTopic={'골드'}
      pageTitle={'골드 상세'}
      pageTopRef={pageTopRef}
    >
      <GoldDetailContainer userId={userId} handleUser={handleUser} />
    </PageLayout>
  );
};

export default GoldDetailPage;
