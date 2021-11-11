import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
const CpCreateConfirmPresenter = () => {
  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box
            sx={{
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
              ></Avatar>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                align="center"
                color="textPrimary"
                variant="h3"
              >
                새로운 CP가 생성(수정) 됐습니다!
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle1"
              >
                CP 계정은 한 번 만들고 수정, 삭제가 힘드니 다시 한 번
                잘 살펴주세요.
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
                to="/dashboard/cp"
                variant="contained"
              >
                CP 리스트 보기
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default CpCreateConfirmPresenter;
