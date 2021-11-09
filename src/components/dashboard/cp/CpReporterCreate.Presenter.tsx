import {
  Card,
  Typography,
  Box,
  TextField,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import {
  CpReporterCreateAction,
  CpReporterCreateActionKind,
  CpReporterCreateState,
} from './CpReporterCreate.Container';

const tudalRecommendScoreOption = [
  {
    title: '1단계',
    value: 1,
  },
  {
    title: '2단계',
    value: 2,
  },
  {
    title: '3단계',
    value: 3,
  },
];

interface CpReporterCreateProps {
  dispatch: (params: CpReporterCreateAction) => void;
  cpCreateState: CpReporterCreateState;
  mode: string;
  createCpReporter: () => Promise<void>;
  onChangeImgae: (event: any) => Promise<boolean>;
}

const CpReporterCreatePresenter: React.FC<CpReporterCreateProps> = (
  props,
) => {
  const {
    cpCreateState,
    dispatch,
    mode,
    createCpReporter,
    onChangeImgae,
  } = props;
  const { newCpReporter, loading, users } = cpCreateState;
  return (
    <>
      <Card sx={{ p: 3, my: 2 }}>
        <Typography color="textPrimary" variant="h6">
          히든 리포터의 내용을 입력해주세요.
        </Typography>
        <Box sx={{ my: 2 }}>
          {users.length > 0 && (
            <TextField
              select
              fullWidth
              label={'유저 선택'}
              name="user"
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={(e) => {
                dispatch({
                  type: CpReporterCreateActionKind.CHANGE_INPUT,
                  payload: e,
                });
              }}
            >
              {users.length > 0 &&
                users.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.username}
                  </option>
                ))}
            </TextField>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="닉네임"
            name="nickname"
            onChange={(e) => {
              dispatch({
                type: CpReporterCreateActionKind.CHANGE_INPUT,
                payload: e,
              });
            }}
            value={newCpReporter.nickname}
            variant="outlined"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            name="intro"
            label="리포터 소개 글"
            value={newCpReporter.intro}
            onChange={(e) => {
              dispatch({
                type: CpReporterCreateActionKind.CHANGE_INPUT,
                payload: e,
              });
            }}
            variant="outlined"
            helperText="줄 바꾸기 enter"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            name="keyword"
            label="단기, 삼성전자, 트랜드, ETF"
            value={newCpReporter.keyword}
            onChange={(e) => {
              dispatch({
                type: CpReporterCreateActionKind.CHANGE_INPUT,
                payload: e,
              });
            }}
            variant="outlined"
            helperText="쉼표(,)로 구분해주세요."
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            select
            name="tudalRecommendScore"
            label="추천 우선 순위"
            SelectProps={{ native: true }}
            value={newCpReporter.tudalRecommendScore}
            onChange={(e) => {
              dispatch({
                type: CpReporterCreateActionKind.CHANGE_INPUT,
                payload: e,
              });
            }}
            variant="outlined"
            helperText="1단계가 가장 높은 우선순위입니다."
          >
            {tudalRecommendScoreOption.map((data) => (
              <option key={data.value} value={data.value}>
                {data.title}
              </option>
            ))}
          </TextField>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ my: 2 }}>프로필 이미지 등록</Typography>
          <input
            id="image"
            name="image"
            accept="image/*"
            type="file"
            onChange={onChangeImgae}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              dispatch({
                type: CpReporterCreateActionKind.CHANGE_IMAGE,
                payload: null,
              });
            }}
          >
            이미지 삭제
          </Button>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            sx={{ mt: 1 }}
          >
            파일 이름이 너무 길 경우 오류가 생길 수 있습니다. (15자
            내외)
          </Typography>
          <Box>
            <Typography sx={{ my: 2 }}>이미지 미리보기</Typography>
            {loading && (
              <div data-testid="news-list-loading">
                <LinearProgress />
              </div>
            )}
            <img
              style={{ width: '100%' }}
              alt={''}
              src={newCpReporter.profile_image_url}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              mt: 6,
            }}
          >
            <Button
              color="primary"
              size="large"
              variant="text"
              component={RouterLink}
              to={`/dashboard/cp`}
            >
              이전
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              variant="contained"
              onClick={createCpReporter}
              component={RouterLink}
              to={`/dashboard/cp`}
            >
              {mode === 'edit' ? '수정' : '생성'}
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default CpReporterCreatePresenter;
