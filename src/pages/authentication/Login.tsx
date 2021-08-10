import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
} from '@material-ui/core';
import { LoginJWT } from '../../components/authentication/login';
import Logo from '../../components/common/Logo';
import useAuth from '../../hooks/useAuth';
import gtm from '../../lib/gtm';

const platformIcons = {
  JWT: '/static/icons/jwt.svg',
};

const logoImage = '/static/logo.png';

const Login: FC = () => {
  const { platform } = useAuth() as any;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="sm" sx={{ py: '80px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 8,
            }}
          >
            <RouterLink to="/">
              <Box
                sx={{
                  height: 40,
                  '& > img': {
                    maxHeight: '100%',
                    width: 'auto',
                  },
                }}
              >
                <img src={logoImage} />
              </Box>
            </RouterLink>
          </Box>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <div>
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h4"
                  >
                    Log in
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                {platform === 'JWT' && <LoginJWT />}
              </Box>
              <Divider sx={{ my: 3 }} />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
