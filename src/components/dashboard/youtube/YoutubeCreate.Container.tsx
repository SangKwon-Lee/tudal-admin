import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { IBuckets } from 'src/components/common/conf/aws';
import { APIYoutube } from 'src/lib/api';
import { registerImage } from 'src/utils/registerImage';
import YoutubeCreatePresenter from './YoutubeCreate.Presenter';

interface YoutubeCreateProps {
  mode: string;
  youtubeId?: number | string;
  pageTopRef?: any;
}

const YoutubeCreateContainer: React.FC<YoutubeCreateProps> = ({
  mode,
  youtubeId,
}) => {
  const navigate = useNavigate();

  const [youtubeInput, setYoutubeInput] = useState({
    title: '',
    link: '',
    thumbnail: '',
  });

  // * 유튜브 등록
  const postYoutube = async () => {
    try {
      if (mode === 'create') {
        const { data } = await APIYoutube.createYoutube(youtubeInput);
        console.log(data);
        toast.success('유튜브가 등록됐습니다.');
        navigate(`/dashboard/youtube/list`);
      } else {
        const { data } = await APIYoutube.putYoutube(
          youtubeInput,
          youtubeId,
        );
        console.log(data);
        toast.success('유튜브가 수정됐습니다.');
        navigate(`/dashboard/youtube/list`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // * 수정시 데이터 가져오기
  const getYoutube = useCallback(async () => {
    try {
      const { data } = await APIYoutube.getYoutube(youtubeId);
      setYoutubeInput({
        ...youtubeInput,
        link: data.link,
        title: data.title,
        thumbnail: data.thumbnail,
      });
    } catch (e) {
      console.log(e);
    }
  }, [youtubeId, youtubeInput]);

  //* 이미지 등록
  const onChangeImage = async (event: any) => {
    var file = event.target.files;
    try {
      // Koscom Cloud에 업로드하기!
      const imageUrl = await registerImage(
        file,
        IBuckets.HIDDENREPORT_IMAGE,
      );
      setYoutubeInput({
        ...youtubeInput,
        thumbnail: imageUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // * 인풋
  const handleInput = (e: any) => {
    setYoutubeInput({
      ...youtubeInput,
      [e.target.name]: e.target.value,
    });
  };

  // * 이미지 삭제
  const deleteImage = () => {
    setYoutubeInput({
      ...youtubeInput,
      thumbnail: '',
    });
  };

  useEffect(() => {
    if (mode === 'edit') {
      getYoutube();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <YoutubeCreatePresenter
      mode={mode}
      deleteImage={deleteImage}
      handleInput={handleInput}
      postYoutube={postYoutube}
      youtubeInput={youtubeInput}
      onChangeImage={onChangeImage}
    />
  );
};
export default YoutubeCreateContainer;
