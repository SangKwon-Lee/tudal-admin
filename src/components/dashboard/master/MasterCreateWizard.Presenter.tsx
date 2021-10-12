import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import MasterContentFormContainer from './MasterContentForm.Container';
import { FC } from 'react';

interface newState {
  completed: boolean;
}

interface IMasterCreateWizardProps {
  newState: newState;
  mode: string;
  handleComplete: () => void;
}

const MasterCreateWizardPresenter: FC<IMasterCreateWizardProps> = (
  props,
) => {
  const { newState, mode, handleComplete } = props;
  const { completed } = newState;

  return (
    <>
      {!completed ? (
        <>
          {mode === 'edit' || mode === 'create' ? (
            <MasterContentFormContainer
              onComplete={handleComplete}
              mode={mode}
            />
          ) : null}
        </>
      ) : (
        <Card>
          <CardContent>
            <Box
              sx={{
                maxWidth: 450,
                mx: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <StarIcon fontSize="small" />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography
                  align="center"
                  color="textPrimary"
                  variant="h3"
                >
                  {mode === 'create'
                    ? '달인이 만들어졌습니다!'
                    : '달인이 수정되었습니다!'}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle1"
                >
                  내용을 자세하게 확인해주세요.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/dashboard/master"
                  variant="contained"
                >
                  달인 보기
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MasterCreateWizardPresenter;
