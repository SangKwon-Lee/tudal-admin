import { IUser } from 'src/types/user';
import { MasterProfileState } from './MasterProfile.Container';
import MasterProfileTable from './MasterProfileTable.Presenter';

interface IMasterProfileProps {
  user: IUser;
  masterProfileState: MasterProfileState;
}

const MasterProfilePresenter: React.FC<IMasterProfileProps> = ({
  user,
  masterProfileState,
}) => {
  return (
    <>
      {user.masters.map((master, i) => (
        <MasterProfileTable key={i} master={master} />
      ))}
    </>
  );
};

export default MasterProfilePresenter;
