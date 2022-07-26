import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { IBuckets } from 'src/components/common/conf/aws';
import { APITest } from 'src/lib/api';
import { registerImage } from 'src/utils/registerImage';
import TestCreatePresenter from './TestCreate.Presenter';

interface TestCreateProps {
  mode: string;
  pageTopRef?: any;
  testId?: number | string;
}

const TestCreateContainer: React.FC<TestCreateProps> = ({ mode }) => {
  const navigate = useNavigate();

  const [testInput, setTestInput] = useState({
    title: '',
    link: '',
    imagesnapshot: '',
  });

  // * Test 등록
  const postTest = async () => {
    try {
      if (mode === 'create') {
        const { data } = await APITest.createTest(testInput);
        console.log(data);
        toast.success('테스트가 등록됐습니다.');
      }
    } catch (e) {
      console.log(e);
    }
  };
  // * 이미지 업로드
  const onChangeImage = async (event: any) => {
    var file = event.target.files;
    try {
      // Koscom Cloud에 업로드하기!
      const imageUrl = await registerImage(
        file,
        IBuckets.HIDDENREPORT_IMAGE,
      );
      setTestInput({
        ...testInput,
        imagesnapshot: imageUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // * 인풋 (업데이트))
  const handleInput = (e: any) => {
    setTestInput({
      ...testInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <TestCreatePresenter
      mode={mode}
      handleInput={handleInput}
      testInput={testInput}
      onChangeImage={onChangeImage}
      postTest={postTest}
    />
  );
};

export default TestCreateContainer;
