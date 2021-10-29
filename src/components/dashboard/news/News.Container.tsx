import React, { useState } from 'react';
import { INews } from 'src/types/news';
import NewsListContainer from './NewsList.Container';
import NewsCommentFormContainer from './NewsCommentForm.Container';

interface INewsContainerProps {
  pageTopRef: React.RefObject<HTMLDivElement>;
}

const NewsContainer: React.FC<INewsContainerProps> = ({
  pageTopRef,
}) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [formTarget, setFormTarget] = useState<INews>(null);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  return (
    <>
      {formTarget && (
        <NewsCommentFormContainer
          isOpen={isOpenForm}
          news={formTarget}
          setOpen={(isOpen) => setIsOpenForm(isOpen)}
          setShouldUpdate={(isUpdate) => setShouldUpdate(isUpdate)}
        />
      )}
      <NewsListContainer
        pageTopRef={pageTopRef}
        formTarget={formTarget}
        isOpenForm={isOpenForm}
        shouldUpdate={shouldUpdate}
        setShouldUpdate={setShouldUpdate}
        setFormTarget={setFormTarget}
        setIsOpenForm={setIsOpenForm}
      />
    </>
  );
};

export default NewsContainer;
