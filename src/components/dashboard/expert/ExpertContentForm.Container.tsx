import { useState, useRef } from 'react';
import type { FC, FormEvent } from 'react';
import '../../../lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { cmsServer } from '../../../lib/axios';
import ExpertContentFormPresenter from './ExpertContentForm.Presenter';

interface ExpertFormProps {
  onComplete?: () => void;
  setValues?: (any) => void;
  values: any;
  mode: string;
}
const ExpertContentFormContainer: FC<ExpertFormProps> = (props) => {
  const { mode, values, onComplete, setValues } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //* 웹 에디터에 전달되는 Props
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
  };

  //* Submit
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    try {
      setIsSubmitting(true);

      if (editorRef.current) {
        const contents = log();
        setValues({
          ...values,
          description: contents,
        });
        const newExpert = {
          ...values,
          description: contents,
        };
        if (mode === 'create') {
          const response = await cmsServer.post(
            '/expert-feeds',
            newExpert,
          );
          console.log(response);
          if (response.status === 200) {
            if (onComplete) {
              onComplete();
            }
          } else {
            return;
          }
        } else {
          const response = await cmsServer.put(
            `/expert-feeds/${newExpert.id}`,
            newExpert,
          );
          if (response.status === 200) {
            if (onComplete) {
              onComplete();
            }
          } else {
            return;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //* 타이틀, 방 변경
  const handleChange = (e: any) => {
    let newInput = {
      ...values,
      [e.target.name]: e.target.value,
    };
    setValues(newInput);
  };

  return (
    <ExpertContentFormPresenter
      editorRef={editorRef}
      values={values}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      error={error}
      isSubmitting={isSubmitting}
    />
  );
};

export default ExpertContentFormContainer;
