import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { IBuckets } from 'src/components/common/conf/aws';
import { APITudalusContents } from 'src/lib/api';
import { registerImage } from 'src/utils/registerImage';
import TudalUsContentsCreatePresenter from './TudalUsContentsCreate.Presenter';

interface TudalUsContentsCreateContainerProps {
  mode: string;
  contentsId?: number | string;
}

const TudalUsContentsCreateContainer = ({
  mode,
  contentsId,
}: TudalUsContentsCreateContainerProps) => {
  const router = useNavigate();
  const [input, setInput] = useState({
    title: '',
    contents: '',
  });
  const [thumbnail, setThumbnail] = useState('');
  const [type, setType] = useState('오늘의 이슈와 주식');

  // * 수정시 데이터 가져오기
  const handleGetContents = async () => {
    try {
      const { data, status } =
        await APITudalusContents.getTudalusContents(contentsId);
      if (status === 200) {
        const { contents, thumbnail, title } = data;
        setInput({
          ...input,
          title,
          contents,
        });
        setThumbnail(thumbnail);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // * 생성 및 수정
  const handleCreateContents = async (data: any) => {
    const contents = log();
    try {
      if (mode === 'edit') {
        const { status } =
          await APITudalusContents.editTudalusContents(contentsId, {
            title: data.title,
            contents,
            thumbnail,
          });
        if (status === 200) {
          alert('콘텐츠가 수정되었습니다.');
          router('/dashboard/tudalus/contents/list');
        }
      } else {
        const { status } =
          await APITudalusContents.createTudalusContents({
            title: data.title,
            contents,
            thumbnail,
          });
        if (status === 200) {
          alert('콘텐츠가 생성되었습니다.');
          router('/dashboard/tudalus/contents/list');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  //* 이미지 등록
  const onChangeImage = async (event: any) => {
    var file = event.target.files;
    try {
      // Koscom Cloud에 업로드하기!
      const imageUrl = await registerImage(file, IBuckets.CP_PHOTO);
      setThumbnail(imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  // * 이미지 삭제
  const deleteImage = () => {
    setThumbnail('');
  };

  const handleChangeType = (e) => {
    setType(e.target.value);
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
      type={type}
      input={input}
      thumbnail={thumbnail}
      editorRef={editorRef}
      deleteImage={deleteImage}
      onChangeImage={onChangeImage}
      handleChangeType={handleChangeType}
      handleCreateContents={handleCreateContents}
    />
  );
};

export default TudalUsContentsCreateContainer;
