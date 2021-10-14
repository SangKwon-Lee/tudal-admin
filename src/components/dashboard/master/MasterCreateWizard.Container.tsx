import { useReducer } from 'react';
import type { FC } from 'react';
import MasterCreateWizardPresenter from './MasterCreateWizard.Presenter';

export enum MasterCreateWizardActionKind {
  HANDLE_COMPLETE = 'HANDLE_COMPLETE',
}

export interface MasterCreateWizardAction {
  type: MasterCreateWizardActionKind;
  payload?: any;
}

export interface MasterCreateWizardState {
  completed: boolean;
}

interface MasterCreateWizardProps {
  mode?: string;
}

const MasterCreateWizardReducer = (
  state: MasterCreateWizardState,
  action: MasterCreateWizardAction,
): MasterCreateWizardState => {
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
  const initialState: MasterCreateWizardState = {
    completed: false,
  };
  const [MasterCreateWizardState, dispatch] = useReducer(
    MasterCreateWizardReducer,
    initialState,
  );

  const mode = props.mode || 'create';

  return (
    <>
      <MasterCreateWizardPresenter
        MasterCreateWizardState={MasterCreateWizardState}
        dispatch={dispatch}
        mode={mode}
      />
    </>
  );
};

export default MasterCreateWizardContainer;
