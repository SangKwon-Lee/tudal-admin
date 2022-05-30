import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';

interface YoutuveCreateProps {
  mode: string;
  handleInput: (e: any) => void;
  youtubeInput: {
    title: string;
    link: string;
    thumbnail: string;
  };
  postYoutube: () => void;
  deleteImage: () => void;
  onChangeImage: (event: any) => void;
}

const YoutubeCreatePresenter: React.FC<YoutuveCreateProps> = ({
  mode,
  handleInput,
  postYoutube,
  deleteImage,
  youtubeInput,
  onChangeImage,
}) => {
  return (
    <>
      <Card sx={{ p: 3, mt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            my: 2,
          }}
        >
          <TextField
            fullWidth
            label="제목"
            name="title"
            variant="outlined"
            helperText="제목을 입력해주세요"
            onChange={handleInput}
            value={youtubeInput.title}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            my: 2,
          }}
        >
          <TextField
            fullWidth
            label="URL"
            name="link"
            variant="outlined"
            helperText="URL을 입력해주세요"
            onChange={handleInput}
            value={youtubeInput.link}
          />
        </Box>
        <Grid item xs={12} lg={6}>
          <Typography
            color="textPrimary"
            sx={{ mb: 1 }}
            variant="subtitle1"
          >
            썸네일 이미지
          </Typography>
          <input
            id="image"
            name="thumbnail"
            accept="image/*"
            type="file"
            onChange={onChangeImage}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={deleteImage}
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
            <img
              style={{ width: '100%', maxHeight: 400 }}
              alt={''}
              src={youtubeInput.thumbnail}
            />
          </Box>
        </Grid>
        <Box
          sx={{
            mt: 3,
            justifyContent: 'flex-end',
            display: 'flex',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={postYoutube}
          >
            {mode === 'edit' ? '수정' : '생성'}
          </Button>
        </Box>
      </Card>
    </>
  );
};
export default YoutubeCreatePresenter;
