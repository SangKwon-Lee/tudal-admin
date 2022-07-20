import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import * as yup from 'yup';
import {
  Card,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Autocomplete,
} from '@material-ui/core';
import { IGropuInput } from 'src/types/group';
import { Stock } from 'src/types/schedule';
import { GroupCreateState } from './GroupCreate.Container';
import { useEffect } from 'react';
import WebEditor from 'src/components/common/WebEditor';
import { IBuckets } from 'src/components/common/conf/aws';

const schema = yup
  .object({
    name: yup.string().required(),
    show: yup.boolean().required(),
    subTitle: yup.string().required(),
    description: yup.string().required(),
    premium: yup.boolean().required(),
  })
  .required();

interface GroupCreateProps {
  mode: string;
  stockList: Stock[];
  stockLoading: boolean;
  groupCreateState: GroupCreateState;
  editorRef: React.MutableRefObject<any>;
  stockInput: React.MutableRefObject<any>;
  handleStockChange: _.DebouncedFunc<() => void>;
  groupCreate: (data: IGropuInput) => Promise<void>;
  onStockChange: (event, stock: Stock[], reason, item) => void;
}

const GroupCreatePresenter: React.FC<GroupCreateProps> = ({
  mode,
  editorRef,
  stockList,
  stockInput,
  groupCreate,
  stockLoading,
  onStockChange,
  groupCreateState,
  handleStockChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues: groupCreateState.newGroup,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(groupCreateState.newGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, groupCreateState.newGroup.id]);

  return (
    <>
      <form onSubmit={handleSubmit(groupCreate)}>
        <Card sx={{ p: 3, my: 4, mx: '2%' }}>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              제목
            </Typography>
            <TextField
              {...register('name')}
              fullWidth
              error={Boolean(errors?.name)}
              helperText={'제목은 필수입니다.'}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              부제목
            </Typography>
            <TextField
              {...register('subTitle')}
              fullWidth
              error={Boolean(errors?.subTitle)}
              helperText={'부제목은 필수입니다.'}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              키워드
            </Typography>
            <TextField
              {...register('description')}
              fullWidth
              variant="outlined"
              error={Boolean(errors?.name)}
              helperText={
                '키워드는 #으로 구별해주세요. ex) #데일리 #업무'
              }
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              종목
            </Typography>
            <Autocomplete
              multiple
              fullWidth
              autoHighlight
              options={stockList}
              value={groupCreateState.stocks}
              getOptionLabel={(option) =>
                option.name + `(${option.code})`
              }
              onChange={onStockChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  onChange={handleStockChange}
                  inputRef={stockInput}
                  helperText={'종목을 선택해주세요.'}
                  name="stocks"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stockLoading && (
                          <CircularProgress
                            color="inherit"
                            size={20}
                          />
                        )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              노출여부
            </Typography>
            <TextField
              select
              fullWidth
              {...register('show')}
              error={Boolean(errors?.show)}
              SelectProps={{ native: true }}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </TextField>
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              프리미엄
            </Typography>
            <TextField
              select
              fullWidth
              {...register('premium')}
              error={Boolean(errors?.premium)}
              SelectProps={{ native: true }}
              variant="outlined"
              sx={{ mx: 1 }}
            >
              <option value="false">공개</option>
              <option value="true">프리미엄</option>
            </TextField>
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography
              color="textPrimary"
              sx={{ mb: 1 }}
              variant="subtitle2"
            >
              내용
            </Typography>
            {mode === 'edit' &&
              (groupCreateState.newGroup.contents ? (
                <WebEditor
                  editorRef={editorRef}
                  contents={groupCreateState.newGroup.contents}
                  bucket_name={IBuckets.HIDDENREPORT}
                ></WebEditor>
              ) : (
                ''
              ))}
            {mode !== 'edit' && (
              <WebEditor
                editorRef={editorRef}
                contents={groupCreateState.newGroup.contents}
                bucket_name={IBuckets.HIDDENREPORT}
              ></WebEditor>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              mt: 3,
              mx: '10%',
            }}
          >
            <Button
              color="secondary"
              size="large"
              variant="text"
              component={RouterLink}
              to={`/dashboard/groups`}
            >
              이전
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="large"
            >
              {mode === 'edit' ? '수정' : '생성'}
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default GroupCreatePresenter;
