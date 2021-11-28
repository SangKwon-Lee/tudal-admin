import { Box, Button } from '@material-ui/core';
import { CpMasterDetailState } from './CpMasterDetail.Container';
import MasterProfileTable from '../master/MasterProfileTable.Presenter';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import toast from 'react-hot-toast';

interface CpMasterDetailProps {
  cpMasterDetailState: CpMasterDetailState;
}
const CpMasterDetailPresenter: React.FC<CpMasterDetailProps> = (
  props,
) => {
  const { user } = useAuth();
  const { cpMasterDetailState } = props;
  const { masters } = cpMasterDetailState;
  const showError = () => {
    toast.error(
      '2개의 달인까지 등록할 수 있습니다. 관리자에게 문의 바랍니다.',
    );
  };

  return (
    <Box>
      {masters.map((master, i) => (
        <MasterProfileTable key={i} master={master} />
      ))}
      <Box
        sx={{
          display: 'flex',
          mt: 6,
          justifyContent: 'flex-end',
        }}
      >
        {masters.length < 2 ? (
          <Button
            variant="contained"
            component={RouterLink}
            to={`/dashboard/cp/master/signup/${user.id}`}
          >
            달인 추가생성
          </Button>
        ) : (
          <Button variant="contained" onClick={showError}>
            달인 추가생성
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CpMasterDetailPresenter;
