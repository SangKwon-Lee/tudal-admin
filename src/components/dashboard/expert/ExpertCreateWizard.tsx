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
import ExpertContentForm from './ExpertContentForm';
import type { Expert } from '../../../types/expert';
import useAuth from '../../../hooks/useAuth';
import axios from '../../../lib/axios';

interface ExpertCreateWizardProps {
  mode?: string;
  expertid?: number;
}

const ExpertCreateWizard: FC<ExpertCreateWizardProps> = (props) => {
  const mode = props.mode || 'create';
  const expertid = props.expertid || 0;
  const { user } = useAuth();
  const initialExpert: any = {
    title: '',
    // room: '',
    description: '',
    author: user.nickname,
  };
  const [completed, setCompleted] = useState<boolean>(false);
  const [newExpert, setNewExpert] = useState<any>(initialExpert);
  const [loading, setLoading] = useState(true);

  //* 수정 | 생성
  useEffect(() => {
    if (mode === 'edit') {
      getExpert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //* 수정 시 기존 데이터 불러오기
  const getExpert = async () => {
    try {
      if (expertid === 0) return;
      const response = await axios.get<Expert>(
        `/expert/${expertid.toString()}`,
      );
      if (response.status === 200) {
        const data = response.data;
        const newExpertData = {
          id: data.id,
          title: data.title,
          description: data.description,
          author: data.author,
        };
        setNewExpert((prev) => ({
          ...prev,
          ...newExpertData,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //* 게시글 작성시 완료 페이지로 이동
  const handleComplete = (): void => {
    setCompleted(true);
  };

  //* values 저장
  const handleSetNewExpert = (values): void => {
    setNewExpert((prev) => ({
      ...prev,
      ...values,
    }));
    console.log('values are changed', values, newExpert);
  };

  return (
    <div {...props}>
      <>
        {!completed ? (
          <>
            {(mode === 'edit' && loading === false) ||
              (mode === 'create' && (
                <ExpertContentForm
                  onComplete={handleComplete}
                  setValues={handleSetNewExpert}
                  values={newExpert}
                  mode={mode}
                />
              ))}
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
                    to="/dashboard/experts"
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
    </div>
  );
};

export default ExpertCreateWizard;
