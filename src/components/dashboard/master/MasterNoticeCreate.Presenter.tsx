import { Card, Box, TextField, Button } from '@material-ui/core';
import WebEditor from 'src/components/common/WebEditor';
import { IBuckets } from 'src/components/common/conf/aws';

interface CpMasterNoticeCreateProps {
  mode: string;
  // user: IUser;
  editorRef: React.RefObject<HTMLDivElement>;
  masterNoticeInput: {
    title: string;
    contents: string;
  };
  handleNoticeInput: (e: any) => void;
  handleCreateNotice: () => Promise<void>;
}

const MasterNoticeCreatePresenter: React.FC<CpMasterNoticeCreateProps> =
  ({
    editorRef,
    mode,
    masterNoticeInput,
    handleCreateNotice,
    handleNoticeInput,
  }) => {
    return (
      <>
        <Card sx={{ p: 3, mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {masterNoticeInput.title && (
              <TextField
                fullWidth
                label="제목"
                name="title"
                variant="outlined"
                helperText="제목을 입력해주세요"
                onChange={handleNoticeInput}
                defaultValue={masterNoticeInput.title}
              />
            )}
            {!masterNoticeInput.title && (
              <TextField
                fullWidth
                name="title"
                label="제목"
                variant="outlined"
                helperText="제목을 입력해주세요"
                onChange={handleNoticeInput}
              />
            )}
          </Box>
          <Box sx={{ mt: 5 }}>
            <WebEditor
              editorRef={editorRef}
              contents={masterNoticeInput.contents}
              bucket_name={IBuckets.MASTER_FEED}
            />
          </Box>
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
              onClick={handleCreateNotice}
            >
              {mode === 'edit' ? '수정' : '생성'}
            </Button>
          </Box>
        </Card>
      </>
    );
  };

export default MasterNoticeCreatePresenter;
