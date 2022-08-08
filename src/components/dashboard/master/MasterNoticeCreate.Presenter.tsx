import { Card, Box, TextField, Button } from '@material-ui/core';
import WebEditor from 'src/components/common/WebEditor';
import { IBuckets } from 'src/components/common/conf/aws';
interface CpMasterNoticeCreateProps {
  mode: string;
  type: string;
  // user: IUser;
  title: string;
  targetId: any;
  summary: string;
  dailyList: any;
  masterList: any;
  contents: string;
  masterId: number;
  reportList: any;
  feedList: any;
  handleTarget: (e: any) => void;
  handleType: (e: any) => void;
  handleSummary: (e: any) => void;
  handleMasterId: (e: any) => void;
  handleCreateNotice: () => Promise<void>;
  handleNoticeInputTitle: (e: any) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  handleNoticeInputContents: (e: any) => void;
}

const typeArr = [
  { name: '피드', value: 'feed' },
  { name: '데일리', value: 'daily' },
  { name: '히든리포트', value: 'hiddenreport' },
  { name: '투달 공지사항', value: 'notice' },
];
const MasterNoticeCreatePresenter: React.FC<CpMasterNoticeCreateProps> =
  ({
    mode,
    type,
    title,
    summary,
    contents,
    targetId,
    feedList,
    masterId,
    dailyList,
    editorRef,
    masterList,
    reportList,
    handleType,
    handleTarget,
    handleSummary,
    handleMasterId,
    handleCreateNotice,
    handleNoticeInputTitle,
    handleNoticeInputContents,
  }) => {
    return (
      <>
        <Card sx={{ p: 3, mt: 3 }}>
          <Box sx={{ my: 2 }}>
            <TextField
              select
              fullWidth
              label={'타입 선택'}
              name="type"
              SelectProps={{ native: true }}
              variant="outlined"
              onChange={handleType}
              value={type}
            >
              {typeArr.map((data: any, i) => (
                <option key={i} value={data.value}>
                  {data.name}
                </option>
              ))}
            </TextField>
          </Box>
          {type === 'daily' && (
            <Box sx={{ my: 2 }}>
              {dailyList.length > 0 && (
                <TextField
                  select
                  fullWidth
                  label={'데일리 선택'}
                  name="daily"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleTarget}
                  value={targetId}
                >
                  {dailyList.map((data: any, i) => (
                    <option key={i} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </TextField>
              )}
            </Box>
          )}
          {type === 'feed' || type === 'hiddenreport' ? (
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
          ) : (
            <></>
          )}
          {type === 'hiddenreport' ? (
            <Box sx={{ my: 2 }}>
              {reportList.length > 0 && (
                <TextField
                  select
                  fullWidth
                  label={'리포트 선택'}
                  name="report"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleTarget}
                  value={targetId}
                >
                  {reportList.map((data: any, i) => (
                    <option key={i} value={data.id}>
                      {data.title}
                    </option>
                  ))}
                </TextField>
              )}
            </Box>
          ) : (
            <></>
          )}
          {type === 'feed' ? (
            <Box sx={{ my: 2 }}>
              {reportList.length > 0 && (
                <TextField
                  select
                  fullWidth
                  label={'피드 선택'}
                  name="feed"
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleTarget}
                  value={targetId}
                >
                  {feedList.map((data: any, i) => (
                    <option key={i} value={data.id}>
                      {data.description}
                    </option>
                  ))}
                </TextField>
              )}
            </Box>
          ) : (
            <></>
          )}

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
              onChange={handleNoticeInputTitle}
              value={title}
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
              label="요약"
              name="summary"
              variant="outlined"
              helperText="요약문을 입력해주세요"
              onChange={handleSummary}
              value={summary}
            />
          </Box>
          <Box sx={{ mt: 7 }}>
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
