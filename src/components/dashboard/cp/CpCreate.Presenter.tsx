import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
} from '@material-ui/core';
import {
  CpCreateState,
  CpCreateActionKind,
  CpCreateAction,
} from './CpCreate.Container';
import { Link as RouterLink } from 'react-router-dom';
interface ICpCreateProps {
  dispatch: (params: CpCreateAction) => void;
  cpCreateState: CpCreateState;
  createCp: () => Promise<void>;
  mode: string;
  checkEmail: (e: any) => void;
}
const roleOption = [
  {
    title: 'Authenticated',
    value: 1,
  },
  {
    title: 'Public',
    value: 2,
  },
];
const typeOption = [
  {
    title: 'cp',
  },
  { title: 'cms' },
  {
    title: 'admin',
  },
];
const CpCreatePresenter: React.FC<ICpCreateProps> = (props) => {
  const { cpCreateState, createCp, dispatch, mode, checkEmail } =
    props;
  const { newCp } = cpCreateState;
  return (
    <Card sx={{ p: 3, my: 2 }}>
      <Typography color="textPrimary" variant="h6">
        {mode === 'edit'
          ? '수정할 내용을 입력해주세요.'
          : '생성할 내용을 입력해주세요.'}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="이름"
          name="username"
          onChange={(e) => {
            dispatch({
              type: CpCreateActionKind.CHANGE_INPUT,
              payload: e,
            });
          }}
          value={newCp.username}
          variant="outlined"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          name="email"
          label="이메일"
          value={newCp.email}
          onChange={checkEmail}
          variant="outlined"
          error={cpCreateState.emailCheck}
          onBlur={checkEmail}
          helperText="올바른 이메일 형식을 지켜주세요"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          name="password"
          label="비밀번호"
          value={newCp.password}
          onChange={(e) => {
            dispatch({
              type: CpCreateActionKind.CHANGE_INPUT,
              payload: e,
            });
          }}
          variant="outlined"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          name="nickname"
          label="닉네임"
          value={newCp.nickname}
          onChange={(e) => {
            dispatch({
              type: CpCreateActionKind.CHANGE_INPUT,
              payload: e,
            });
          }}
          variant="outlined"
        />
      </Box>
      <Box sx={{ my: 2 }}>
        {typeOption.length > 0 && (
          <TextField
            select
            fullWidth
            label="타입"
            name="type"
            SelectProps={{ native: true }}
            variant="outlined"
            value={newCp.type}
            onChange={(e) => {
              dispatch({
                type: CpCreateActionKind.CHANGE_INPUT,
                payload: e,
              });
            }}
          >
            {typeOption.length > 0 &&
              typeOption.map((data) => (
                <option key={data.title} value={data.title}>
                  {data.title}
                </option>
              ))}
          </TextField>
        )}
      </Box>
      <Box sx={{ my: 2 }}>
        {roleOption.length > 0 && (
          <TextField
            select
            fullWidth
            label="역할"
            name="role"
            SelectProps={{ native: true }}
            variant="outlined"
            value={newCp.role}
            onChange={(e) => {
              dispatch({
                type: CpCreateActionKind.CHANGE_INPUT,
                payload: e,
              });
            }}
          >
            {roleOption.length > 0 &&
              roleOption.map((data) => (
                <option key={data.value} value={data.value}>
                  {data.title}
                </option>
              ))}
          </TextField>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          name="phone_number"
          label="전화 번호"
          value={newCp.phone_number}
          onChange={(e) => {
            dispatch({
              type: CpCreateActionKind.CHANGE_INPUT,
              payload: e,
            });
          }}
          helperText="-없이 입력해주세요."
          variant="outlined"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          name="contact_email"
          label="연락할 이메일"
          value={newCp.contact_email}
          onChange={checkEmail}
          variant="outlined"
          error={cpCreateState.contactEmailCheck}
          onBlur={checkEmail}
          helperText="올바른 이메일 형식을 지켜주세요"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          mt: 6,
        }}
      >
        <Button
          color="primary"
          size="large"
          variant="text"
          component={RouterLink}
          to={`/dashboard/cp`}
        >
          이전
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="primary"
          variant="contained"
          onClick={createCp}
          component={RouterLink}
          to="/dashboard/cp/confirm"
          disabled={
            !cpCreateState.emailCheck &&
            !cpCreateState.contactEmailCheck
              ? false
              : true
          }
        >
          {mode === 'edit' ? '수정' : '생성'}
        </Button>
      </Box>
    </Card>
  );
};

export default CpCreatePresenter;
