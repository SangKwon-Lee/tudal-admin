import { useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import HiddenboxContentForm from './HiddenboxContentForm';
import HiddenboxDetailsForm from './HiddenboxDetailsForm';
import type { Hiddenbox } from '../../../types/hiddenbox';
import moment from 'moment';
import useAuth from '../../../hooks/useAuth';

const HiddenboxCreateWizard: FC = (props) => {
  const { user, logout } = useAuth();
  const initialHiddenbox: any = {
    title: '',
    description: '',
    contents: '',
    productId: 'hiddenbox-basic',
    tags: [],
    stocks: [],
    startDate: (moment().add(1, 'day').set('hour', 7).set('minute', 0)).toDate(),
    endDate: (moment().add(1, 'day').set('hour', 9).set('minute', 0)).toDate(),
    publicDate: (moment().add(7, 'day').set('hour', 17).set('minute', 0)).toDate(),
    author: parseInt(user.id)
  }

  const [activeStep, setActiveStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [newHiddenbox, setNewHiddenbox] = useState<any>(initialHiddenbox);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = (): void => {
    setCompleted(true);
  };

  const handleSetNewHiddenbox = (values): void => {
    setNewHiddenbox(prev => ({
      ...prev,
      ...values 
    }))
    console.log("values are changed", values, newHiddenbox);
  }

  return (
    <div {...props}>
      {
        !completed
          ? (
            <>
              {activeStep === 0 && (
                <HiddenboxDetailsForm 
                  onNext={handleNext} 
                  setValues={handleSetNewHiddenbox}
                  values={newHiddenbox}
                />
              )}
              {activeStep === 1 && (
                <HiddenboxContentForm
                  onBack={handleBack}
                  onComplete={handleComplete}
                  setValues={handleSetNewHiddenbox}
                  values={newHiddenbox}
                />
              )}
            </>
          )
          : (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    maxWidth: 450,
                    mx: 'auto'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
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
                      히든박스가 만들어졌습니다!
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="subtitle1"
                    >
                      유료결제 상품이니 판매일 및 공개일을 다시 한 번 잘 살펴주세요.
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 2
                    }}
                  >
                    <Button
                      color="primary"
                      component={RouterLink}
                      to="/dashboard/hiddenboxes"
                      variant="contained"
                    >
                      히든박스 보기
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
      }
    </div>
  );
};

export default HiddenboxCreateWizard;
