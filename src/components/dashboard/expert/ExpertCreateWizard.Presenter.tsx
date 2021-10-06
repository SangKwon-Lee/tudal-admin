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
import ExpertContentFormContainer from './ExpertContentForm.Container';
import { Expert } from 'src/types/expert';
import { FC } from 'react';

interface IExpertCreateWizardProps {
  newExpert: Expert;
  mode: string;
  completed: boolean;
  loading: boolean;
  handleComplete: () => void;
  handleSetNewExpert: (values: any) => void;
}

const ExpertCreateWizardPresenter: FC<IExpertCreateWizardProps> = (
  props,
) => {
  const {
    completed,
    loading,
    mode,
    handleComplete,
    handleSetNewExpert,
    newExpert,
  } = props;

  return (
    <>
      {!completed ? (
        <>
          {(mode === 'edit' && loading === false) ||
          mode === 'create' ? (
            <ExpertContentFormContainer
              onComplete={handleComplete}
              setValues={handleSetNewExpert}
              values={newExpert}
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
                  to="/dashboard/expert"
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

export default ExpertCreateWizardPresenter;
