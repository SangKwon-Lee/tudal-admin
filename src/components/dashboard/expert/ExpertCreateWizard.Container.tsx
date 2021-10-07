import { useReducer } from 'react';
import type { FC } from 'react';
import ExpertCreateWizardPresenter from './ExpertCreateWizard.Presenter';

enum ExpertCreateWizardActionKind {
  HANDLE_COMPLETE = 'HANDLE_COMPLETE',
}

interface ExpertCreateWizardAction {
  type: ExpertCreateWizardActionKind;
  payload?: any;
}

interface newState {
  completed: boolean;
}

interface ExpertCreateWizardProps {
  mode?: string;
}

const ExpertCreateWizardReducer = (
  state: newState,
  action: ExpertCreateWizardAction,
): newState => {
  const { type } = action;
  switch (type) {
    case ExpertCreateWizardActionKind.HANDLE_COMPLETE:
      return {
        ...state,
        completed: true,
      };
  }
};

const ExpertCreateWizardContainer: FC<ExpertCreateWizardProps> = (
  props,
) => {
  const initialState: newState = {
    completed: false,
  };
  const [newState, dispatch] = useReducer(
    ExpertCreateWizardReducer,
    initialState,
  );
  const mode = props.mode || 'create';

  //* 게시글 작성시 완료 페이지로 이동
  const handleComplete = (): void => {
    dispatch({ type: ExpertCreateWizardActionKind.HANDLE_COMPLETE });
  };

  return (
    <>
      <ExpertCreateWizardPresenter
        newState={newState}
        handleComplete={handleComplete}
        mode={mode}
      />
    </>
  );
};

export default ExpertCreateWizardContainer;
