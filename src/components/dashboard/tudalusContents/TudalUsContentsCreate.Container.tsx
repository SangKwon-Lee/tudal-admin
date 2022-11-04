import { useEffect, useRef, useState } from 'react';
import { APITudalusContents } from 'src/lib/api';
import TudalUsContentsCreatePresenter from './TudalUsContentsCreate.Presenter';

interface TudalUsContentsCreateContainerProps {
  mode: string;
  contentsId?: number | string;
}

const TudalUsContentsCreateContainer = ({
  mode,
  contentsId,
}: TudalUsContentsCreateContainerProps) => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  // * 수정시 데이터 가져오기
  const handleGetContents = async () => {
    try {
      const { data, status } =
        await APITudalusContents.getTudalusContents(contentsId);
      if (status === 200) {
        setTitle(data.title);
        setContents(data.contents);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // * 생성 및 수정
  const handleCreateContents = async (data: any) => {
    const text = log();
    try {
      if (mode === 'edit') {
        const { status } =
          await APITudalusContents.editTudalusContents(contentsId, {
            title: data.title,
            contents: text,
          });
        if (status === 200) {
          alert('콘텐츠가 수정되었습니다.');
        }
      } else {
        const { status } =
          await APITudalusContents.createTudalusContents({
            title: data.title,
            contents: text,
          });
        if (status === 200) {
          alert('콘텐츠가 생성되었습니다.');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  //* 웹 에디터에 전달되는 Props
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

  useEffect(() => {
    if (contentsId || mode === 'edit') {
      handleGetContents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentsId]);

  return (
    <TudalUsContentsCreatePresenter
      mode={mode}
      title={title}
      contents={contents}
      editorRef={editorRef}
      handleCreateContents={handleCreateContents}
    />
  );
};

export default TudalUsContentsCreateContainer;
