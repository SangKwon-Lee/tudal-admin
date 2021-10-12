import { useReducer } from 'react';
import type { FC } from 'react';
import MasterCreateWizardPresenter from './MasterCreateWizard.Presenter';

enum MasterCreateWizardActionKind {
  HANDLE_COMPLETE = 'HANDLE_COMPLETE',
}

interface MasterCreateWizardAction {
  type: MasterCreateWizardActionKind;
  payload?: any;
}

interface newState {
  completed: boolean;
}

interface MasterCreateWizardProps {
  mode?: string;
}

const MasterCreateWizardReducer = (
  state: newState,
  action: MasterCreateWizardAction,
): newState => {
  const { type } = action;
  switch (type) {
    case MasterCreateWizardActionKind.HANDLE_COMPLETE:
      return {
        ...state,
        completed: true,
      };
  }
};

const MasterCreateWizardContainer: FC<MasterCreateWizardProps> = (
  props,
) => {
  const initialState: newState = {
    completed: false,
  };
  const [newState, dispatch] = useReducer(
    MasterCreateWizardReducer,
    initialState,
  );
  const mode = props.mode || 'create';

  //* 게시글 작성시 완료 페이지로 이동
  const handleComplete = (): void => {
    dispatch({ type: MasterCreateWizardActionKind.HANDLE_COMPLETE });
  };

  return (
    <>
      <MasterCreateWizardPresenter
        newState={newState}
        handleComplete={handleComplete}
        mode={mode}
      />
    </>
  );
};

export default MasterCreateWizardContainer;
