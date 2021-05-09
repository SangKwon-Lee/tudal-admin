import type { FC } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  TextField
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

const LoginJWT: FC = (props) => {
  const isMountedRef = useIsMountedRef();
  const { login } = useAuth() as any;

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            email: Yup
              .string()
              .email('올바른 이메일을 입력해주세요.')
              .max(255)
              .required('이메일을 입력해주세요.'),
            password: Yup
              .string()
              .max(255)
              .required('비밀번호를 입력해주세요.')
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          await login(values.email, values.password);

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: '이메일 또는 비밀번호가 잘못되었습니다.' });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }): JSX.Element => (
        <form
          noValidate
          onSubmit={handleSubmit}
          {...props}
        >
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="이메일"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="비밀번호"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              로그인
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
