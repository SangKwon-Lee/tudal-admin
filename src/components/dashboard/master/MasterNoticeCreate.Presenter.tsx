import { Card, Box, TextField, Button } from '@material-ui/core';
import WebEditor from 'src/components/common/WebEditor';
import { IBuckets } from 'src/components/common/conf/aws';

interface CpMasterNoticeCreateProps {
  mode: string;
  // user: IUser;
  editorRef: React.RefObject<HTMLDivElement>;
  masterList: any;
  title: string;
  contents: string;
  masterId: number;
  handleNoticeInputTitle: (e: any) => void;
  handleCreateNotice: () => Promise<void>;
  handleNoticeInputContents: (e: any) => void;
  handleMasterId: (e: any) => void;
}

const MasterNoticeCreatePresenter: React.FC<CpMasterNoticeCreateProps> =
  ({
    editorRef,
    mode,
    title,
    contents,
    handleCreateNotice,
    handleNoticeInputTitle,
    handleNoticeInputContents,
    masterList,
    handleMasterId,
    masterId,
  }) => {
    return (
      <>
        <Card sx={{ p: 3, mt: 3 }}>
          <Box sx={{ my: 2 }}>
            {masterList.length > 0 && (
              <TextField
                select
                fullWidth
                label={'달인 선택'}
                name="master"
                SelectProps={{ native: true }}
                variant="outlined"
                onChange={handleMasterId}
                value={masterId}
              >
                {masterList.map((data: any, i) => (
                  <option key={i} value={data.id}>
                    {data.nickname}
                  </option>
                ))}
              </TextField>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              fullWidth
              label="제목"
              name="title"
              variant="outlined"
              helperText="제목을 입력해주세요"
              onChange={handleNoticeInputTitle}
              value={title}
            />
          </Box>
          <Box sx={{ mt: 5 }}>
            <WebEditor
              editorRef={editorRef}
              contents={contents}
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
