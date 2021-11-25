import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Link,
  TextField,
} from '@material-ui/core';
import * as _ from 'lodash';
import dayjs from 'dayjs';
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
