import { useState } from 'react';
import type { FC } from 'react';
import { Box, Button, FormHelperText } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

const RegisterAuth0: FC = (props) => {
  const isMountedRef = useIsMountedRef();
  const { loginWithPopup } = useAuth() as any;
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (): Promise<void> => {
    try {
      await loginWithPopup();
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    }
  };

  return (
    <div {...props}>
      {error && (
        <Box sx={{ my: 3 }}>
          <FormHelperText error>
            {error}
          </FormHelperText>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          color="primary"
          onClick={handleRegister}
          variant="contained"
        >
          Register
        </Button>
      </Box>
    </div>
  );
};

export default RegisterAuth0;
