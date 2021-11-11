import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
} from '@material-ui/core';
import { CpCreateState, CpCreateAction } from './CpCreate.Container';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserInput } from 'src/types/user';

const schema = yup
  .object({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    nickname: yup.string().required(),
    type: yup.string().required(),
    role: yup.string().required(),
    phone_number: yup.string().required(),
    contact_email: yup.string().email().required(),
  })
  .required();

interface ICpCreateProps {
  dispatch: (params: CpCreateAction) => void;
  cpCreateState: CpCreateState;
  createCp: (data: UserInput) => Promise<void>;
  mode: string;
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
  const { mode, createCp } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({ resolver: yupResolver(schema) });

  return (
    <form onSubmit={handleSubmit(createCp)}>
      <Card sx={{ p: 3, my: 2 }}>
        <Typography color="textPrimary" variant="h6">
          {mode === 'edit'
            ? '수정할 내용을 입력해주세요.'
            : '생성할 내용을 입력해주세요.'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            {...register('username')}
            fullWidth
            label="이름"
            variant="outlined"
            error={errors.username ? true : false}
            helperText={'이름은 필수입니다.'}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            {...register('email')}
            fullWidth
            label="이메일"
            variant="outlined"
            error={errors.email ? true : false}
            helperText="올바른 이메일 형식을 지켜주세요"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            {...register('password')}
            fullWidth
            type="password"
            label="비밀번호"
            variant="outlined"
            error={errors.password ? true : false}
            helperText="비밀번호는 필수입니다."
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            {...register('nickname')}
            fullWidth
            label="닉네임"
            error={errors.nickname ? true : false}
            helperText="닉네임은 필수입니다."
            variant="outlined"
          />
        </Box>
        <Box sx={{ my: 2 }}>
          {typeOption.length > 0 && (
            <TextField
              {...register('type')}
              select
              fullWidth
              label="타입"
              SelectProps={{ native: true }}
              variant="outlined"
              error={errors.type ? true : false}
              helperText="타입은 필수입니다."
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
              {...register('role')}
              fullWidth
              label="역할"
              SelectProps={{ native: true }}
              variant="outlined"
              error={errors.role ? true : false}
              helperText="역할은 필수입니다."
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
            {...register('phone_number')}
            fullWidth
            name="phone_number"
            label="전화 번호"
            error={errors.phone_number ? true : false}
            helperText="-없이 입력해주세요."
            variant="outlined"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            {...register('contact_email')}
            fullWidth
            label="연락할 이메일"
            variant="outlined"
            error={errors.contact_email ? true : false}
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
          <Button type="submit" color="primary" variant="contained">
            {mode === 'edit' ? '수정' : '생성'}
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default CpCreatePresenter;
