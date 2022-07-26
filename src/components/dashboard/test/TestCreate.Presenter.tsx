import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

interface TestCreateProps {
  mode: string;
  handleInput: (e: any) => void;
  testInput: {
    title: string;
    link: string;
    imagesnapshot: string;
  };
  onChangeImage: (event: any) => void;
  postTest: () => void;
}

const TestCreatePresenter: React.FC<TestCreateProps> = ({
  mode,
  handleInput,
  testInput,
  onChangeImage,
  postTest,
}) => {
  return (
    <>
      <Card sx={{ p: 2, mt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mt: 3,
          }}
        >
          <TextField
            fullWidth
            label="제목"
            name="title"
            helperText="제목을 입력해주세요"
            onChange={handleInput}
            value={testInput.title}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mt: 2,
          }}
        >
          <TextField
            fullWidth
            label="URL"
            name="link"
            helperText="URL을 입력해주세요"
            onChange={handleInput}
            value={testInput.link}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              mt: 2,
              mb: 2,
            }}
          >
            썸네일 이미지
          </Typography>
          <input
            type="file"
            id="image"
            name="imagesnapshot"
            accept="image/*"
            onChange={onChangeImage}
          />
          <Button variant="contained" component="span">
            이미지 삭제
          </Button>
        </Box>
        <Typography
          sx={{
            mt: 1,
          }}
          variant="subtitle2"
          color="GrayText"
        >
          파일 이름이 너무 길 경우 오류가 생길 수 있습니다. (15자
          내외)
        </Typography>

        <Typography
          sx={{
            mt: 1,
          }}
        >
          이미지 미리보기
        </Typography>
        <img
          style={{
            width: '100%',
            maxHeight: 400,
          }}
          alt={''}
          src={testInput.imagesnapshot}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 1,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            onClick={postTest}
          >
            생성
          </Button>
        </Box>
      </Card>
    </>
  );
};
export default TestCreatePresenter;
