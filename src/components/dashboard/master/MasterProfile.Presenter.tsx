import { IMaster } from 'src/types/master';
import { MasterProfileState } from './MasterProfile.Container';
import MasterProfileTable from './MasterProfileTable.Presenter';

interface IMasterProfileProps {
  masters: IMaster[];
  masterProfileState: MasterProfileState;
}

const MasterProfilePresenter: React.FC<IMasterProfileProps> = ({
  masters,
  masterProfileState,
}) => {
  return (
    <>
      {masters.map((master, i) => (
        <MasterProfileTable key={i} master={master} />
      ))}
    </>
  );
};

export default MasterProfilePresenter;
