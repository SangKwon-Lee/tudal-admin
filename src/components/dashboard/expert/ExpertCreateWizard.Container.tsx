import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Expert } from '../../../types/expert';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../lib/axios';
import ExpertCreateWizardPresenter from './ExpertCreateWizard.Presenter';
import { useParams } from 'react-router-dom';
interface ExpertCreateWizardProps {
  mode?: string;
}

const ExpertCreateWizardContainer: FC<ExpertCreateWizardProps> = (
  props,
) => {
  const mode = props.mode || 'create';
  const { expertId } = useParams();
  const { user } = useAuth();
  const initialExpert: any = {
    title: '',
    // room: '',
    description: '',
    author: user.nickname,
  };
  const [completed, setCompleted] = useState<boolean>(false);
  const [newExpert, setNewExpert] = useState<Expert>(initialExpert);
  const [loading, setLoading] = useState(true);

  //* 수정 | 생성
  useEffect(() => {
    if (mode === 'edit') {
      getExpert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* 수정 시 기존 데이터 불러오기
  const getExpert = async () => {
    try {
      if (expertId.toString() === '0') return;
      const response = await axios.get<Expert>(
        `/expert-feeds/${expertId.toString()}`,
      );
      if (response.status === 200) {
        const data = response.data;
        const newExpertData = {
          id: data.id,
          title: data.title,
          description: data.description,
          author: data.author,
        };
        setNewExpert((prev) => ({
          ...prev,
          ...newExpertData,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //* 게시글 작성시 완료 페이지로 이동
  const handleComplete = (): void => {
    setCompleted(true);
  };

  //* values 저장
  const handleSetNewExpert = (values): void => {
    setNewExpert((prev) => ({
      ...prev,
      ...values,
    }));
    console.log('values are changed', values, newExpert);
  };

  return (
    <>
      <ExpertCreateWizardPresenter
        newExpert={newExpert}
        completed={completed}
        loading={loading}
        handleComplete={handleComplete}
        handleSetNewExpert={handleSetNewExpert}
        mode={mode}
      />
    </>
  );
};

export default ExpertCreateWizardContainer;
