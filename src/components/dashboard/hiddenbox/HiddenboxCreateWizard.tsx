import { useState, useEffect } from 'react';
import type { FC } from 'react';
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
import HiddenboxContentForm from './HiddenboxContentForm';
import HiddenboxDetailsForm from './HiddenboxDetailsForm';
import type { Hiddenbox } from '../../../types/hiddenbox';
import moment from 'moment';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../lib/axios';

interface HiddenboxCreateWizardProps {
  mode?: string;
  boxid?: number;
}

const HiddenboxCreateWizard: FC<HiddenboxCreateWizardProps> = (
  props,
) => {
  const mode = props.mode || 'create';
  const hiddenboxId = props.boxid || 0;
  const { user } = useAuth();
  const initialHiddenbox: any = {
    title: '',
    description: '',
    contents: '',
    productId: 'hiddenbox_basic',
    tags: [],
    stocks: [],
    startDate: moment()
      .add(1, 'day')
      .set('hour', 7)
      .set('minute', 0)
      .toDate(),
    endDate: moment()
      .add(1, 'day')
      .set('hour', 9)
      .set('minute', 0)
      .toDate(),
    publicDate: moment()
      .add(7, 'day')
      .set('hour', 17)
      .set('minute', 0)
      .toDate(),
    author: parseInt(user.id),
  };
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [newHiddenbox, setNewHiddenbox] =
    useState<any>(initialHiddenbox);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mode === 'edit') {
      getHiddenbox();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHiddenbox = async () => {
    try {
      if (hiddenboxId === 0) return;

      const response = await axios.get<Hiddenbox>(
        `/hiddenboxes/${hiddenboxId.toString()}`,
      );
      if (response.status === 200) {
        const data = response.data;
        const newHiddenboxData = {
          id: data.id,
          title: data.title,
          description: data.description,
          productId: data.productId,
          contents: data.contents,
          tags: data.tags,
          stocks: data.stocks,
          startDate: moment(data.startDate).toDate(),
          endDate: moment(data.endDate).toDate(),
          publicDate: moment(data.publicDate).toDate(),
          author: data.author.id,
        };
        setNewHiddenbox((prev) => ({
          ...prev,
          ...newHiddenboxData,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    setNewHiddenbox((prev) => ({
      ...prev,
      ...values,
    }));
    // console.log('values are changed', values, newHiddenbox);
  };

  return (
    <div {...props}>
      {/* {productStatus[0] === 'beforeSale' ||
      productStatus[0] === 'onSale' ? ( */}
      <>
        {!completed ? (
          <>
            {activeStep === 0 &&
            ((mode === 'edit' && loading === false) ||
              mode === 'create') ? (
              <HiddenboxDetailsForm
                onNext={handleNext}
                setValues={handleSetNewHiddenbox}
                values={newHiddenbox}
                mode={mode}
              />
            ) : null}
            {activeStep === 1 && (
              <HiddenboxContentForm
                onBack={handleBack}
                onComplete={handleComplete}
                setValues={handleSetNewHiddenbox}
                values={newHiddenbox}
                mode={mode}
              />
            )}
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
                      ? '히든박스가 만들어졌습니다!'
                      : '히든박스가 수정되었습니다!'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="subtitle1"
                  >
                    유료결제 상품이니 판매일 및 공개일을 다시 한 번 잘
                    살펴주세요.
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
                    to="/dashboard/hiddenboxes"
                    variant="contained"
                  >
                    히든박스 보기
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </>
      {/* ) : (
        '판매 완료나 공개중인 상품은 수정할 수 없습니다.'
      )} */}
    </div>
  );
};

export default HiddenboxCreateWizard;
