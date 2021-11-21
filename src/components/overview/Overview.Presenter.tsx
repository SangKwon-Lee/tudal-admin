import React from 'react';
import useAuth from 'src/hooks/useAuth';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import dayjs from 'dayjs';
interface IOverviewProps {
  time: string;
  greet: string;
}

const moto = [
  "Don't dwell on the past.",
  'Believe in yourself.',
  'Follow your heart.',
  'Seize the day.',
  'Love yourself.',
  'Life is a journey',
  'The die is cast',
  'Be brave.',
  'If not now, then when?',
  'You deserve to be loved.',
  'Love what you do.',
];

const OverviewPresenter: React.FC<IOverviewProps> = ({ greet }) => {
  const { user } = useAuth();
  const hour = dayjs().hour() * 60;
  const min = dayjs().minute();
  const deadline =
    ((hour + min - 540) / 390) * 100 < 0
      ? 0
      : ((hour + min - 540) / 390) * 100;
  return (
    <>
      <Grid container spacing={3}>
        <Grid
          alignItems="center"
          container
          justifyContent="space-between"
          spacing={3}
          item
          xs={12}
        >
          <Grid item>
            <Typography color="textPrimary" variant="h5">
              반갑습니다, {user.username} 님
            </Typography>
            <Typography color="textSecondary" variant="subtitle2">
              Here&apos;s what&apos;s happening today
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography fontSize={150}>
            {dayjs().format('HH:mm')}
          </Typography>
          <Typography fontSize={40} sx={{ mt: -4 }}>
            Good {greet}, {user.username}
          </Typography>
        </Box>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: 2,
        }}
      >
        <Table sx={{ width: '50%' }}>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Phone
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {user?.phone_number
                    ? user.phone_number
                    : 'please register'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textPrimary" variant="subtitle2">
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="body2">
                  {user?.contact_email
                    ? user.contact_email
                    : 'please register'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          className="progress"
          style={{
            display: 'flex',
            backgroundColor: '#d8d8d8',
            borderRadius: '20px',
            height: '30px',
            width: '350px',
          }}
        >
          <div
            className="progress-done"
            style={{
              background:
                'linear-gradient(45deg, #00e676 30%, #33eb91 90%)',
              borderRadius: '20px',
              boxShadow: '0 3px 3px -5px #33eb91, 0 2px 5px #33eb91',
              height: '100%',
              width: `${deadline}%`,
              transition: '1s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '10px',
            }}
          >
            {Math.floor(deadline)}%
          </div>
        </div>
        <Typography fontSize="10px" sx={{ mt: 1 }}>
          Stock market closing time
        </Typography>
        <Typography sx={{ position: 'absolute', bottom: '0', mb: 2 }}>
          "{moto[Math.floor(Math.random() * 11)]}"
        </Typography>
      </Box>
    </>
  );
};

export default OverviewPresenter;
