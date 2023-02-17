import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { APIStock, APITag } from 'src/lib/api';
import toast from 'react-hot-toast';
import useAsync from 'src/hooks/useAsync';
import _ from 'lodash';
import { Stock } from 'src/types/todaykeyword';
import { Tag } from 'src/types/schedule';
import { ArrowRightAlt } from '@material-ui/icons';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
interface Props {
  keywordId: number;
}

export default function NewKeywordDrawer(props: Props) {
  const { keywordId } = props;
  const [input, setInput] = useState({
    name: '',
    summary: '',
    description: '',
    stocks: [],
    tag_aliases: [],
  });
  const stockInput = useRef(null);
  const tagInput = useRef(null);
  //* 입력하는 Alias
  const [alias, setAlias] = useState('');
  //* 추가될 종목 목록
  const [newStocks, setNewStocks] = useState([]);
  //* 추가될 Alias 목록
  const [newAliases, setNewAliases] = useState([]);
  //* 키워드 통합시 물어보는 Modal
  const [openModal, setOpenModal] = useState(false);
  //* 통합할 키워드
  const [mainKeyword, setMainKeyword] = useState({
    created_at: '',
    description: '',
    expert_feed: null,
    id: 0,
    isDeleted: null,
    name: '',
    summary: '',
    updated_at: '',
  });
  //* 최신성 누른 종목
  const [updateStocks, setUpdateStocks] = useState([]);

  //* 기존 Stocks 삭제
  const handleDeleteStocks = (e) => {
    setInput({
      ...input,
      stocks: input.stocks.filter((data) => data.id !== e.id),
    });
  };

  //* 기존 Aliases 삭제
  const handleDeleteAliases = (e) => {
    setInput({
      ...input,
      tag_aliases: input.tag_aliases.filter(
        (data) => data.name !== e,
      ),
    });
  };

  // * input 수정
  const handleChangeInput = (e: any) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  //* Aliases추가
  const handleAddAliase = () => {
    setNewAliases([...newAliases, alias]);
    setAlias('');
  };

  //* 새로 입력하는 Aliases 삭제
  const handleRemoveAliase = (alias) => {
    let newData = [...newAliases];
    newData = newData.filter((data) => data !== alias);
    setNewAliases(newData);
  };
  //* 키워드 최신성 유지
  const updateStockKeyword = async (stock) => {
    try {
      const { status } = await APIStock.updateTag(
        stock.code,
        input.name,
      );
      setUpdateStocks([...updateStocks, stock.code]);
      if (status === 200) {
        toast.success('업데이트 되었습니다.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  //* 키워드 정보 받아오기
  const getKeywordInfo = useCallback(async () => {
    try {
      const { data, status } = await APITag.getTagDetail(keywordId);
      if (status === 200) {
        console.log(data);
        setInput({
          ...input,
          name: data.name,
          description: data.description,
          summary: data.summary,
          stocks: data.stocks,
          tag_aliases: data.tag_aliases,
        });
      }
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordId]);

  //* 키워드 생성
  const createKeyword = async () => {
    if (newAliases.includes(input.name)) {
      toast.error('자기 자신은 alias로 추가할 수 없습니다.');
      return;
    }
    try {
      const { data, status } = await APITag.createTag({
        name: input.name,
        summary: input.summary,
        description: input.description,
        stocks: newStocks,
        tag_aliases: [],
      });
      if (status === 200) {
        const result = await Promise.all(
          newAliases.map(async (item) => {
            return await APITag.createAlias({
              name: item,
              tag: data.id,
            });
          }),
        );
        if (result.length > 0) {
          toast.success('정상처리 됐습니다.');
          window.location.reload();
        }
      }
    } catch (e) {
      if (e?.message) {
        toast.error(e.message);
      }
      console.log(e);
    }
  };
  //* 키워드 정보 수정
  const updateKeywordInfo = async () => {
    if (newAliases.includes(input.name)) {
      toast.error('자기 자신은 alias로 추가할 수 없습니다.');
      return;
    }
    try {
      const result = await Promise.all(
        newAliases.map(async (data) => {
          return await APITag.createAlias({
            name: data,
            tag: keywordId,
          });
        }),
      );
      if (Array.isArray(result)) {
        const { data, status } = await APITag.updateTagDetail(
          keywordId,
          {
            name: input.name,
            description: input.description,
            summary: input.summary,
            stocks: [...input.stocks, ...newStocks],
            tag_aliases: [
              ...input.tag_aliases,
              ...result.map((data) => data.data),
            ],
          },
        );
        console.log(data);
        if (status === 200) {
          toast.success('정상처리 됐습니다.');
          setNewAliases([]);
          setNewStocks([]);
          getKeywordInfo();
          deleteAlias();
        }
      }
    } catch (e) {
      if (e?.message) {
        toast.error('추가하려는 alias가 이미 존재합니다');
      }
      console.log(e);
    }
  };

  //* 키워드 삭제
  const deleteKeyword = async () => {
    try {
      const { status } = await APITag.remove(keywordId);
      if (status === 200) {
        toast.success('정상처리 됐습니다.');
        await Promise.all(
          input.tag_aliases.map(async (data) => {
            return await APITag.deleteAlias(data.id);
          }),
        );
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  //* 남은 태그 삭제
  const deleteAlias = async () => {
    try {
      const { data, status } = await APITag.getAliasList();
      if (status === 200) {
        await Promise.all(
          data
            .filter((data) => data.tag === null)
            .map(async (data) => {
              return await APITag.deleteAlias(data.id);
            }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  //* 키워드 통합
  const combineKeyword = async () => {
    if (input.name === mainKeyword?.name) {
      toast.error('키워드가 서로 같습니다.');
    }
    try {
      const { status: deleteStatus } = await APITag.remove(keywordId);
      if (deleteStatus === 200) {
        await Promise.all(
          input.tag_aliases.map(async (data) => {
            return await APITag.deleteAlias(data.id);
          }),
        );
        const { status } = await APITag.createAlias({
          name: input.name,
          tag: mainKeyword.id,
        });
        if (status === 200) {
          toast.success('정상처리 됐습니다.');
          window.location.reload();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (keywordId !== 0) {
      getKeywordInfo();
    }
  }, [keywordId, getKeywordInfo]);

  //* 키워드 선택
  const handleKeywordChange = (event, keyword, reason, item) => {
    switch (reason) {
      case 'selectOption':
        setMainKeyword(keyword);
        break;
      case 'clear':
        setMainKeyword({
          created_at: '',
          description: '',
          expert_feed: null,
          id: 0,
          isDeleted: null,
          name: '',
          summary: '',
          updated_at: '',
        });
        break;
    }
  };

  // *종목 변경
  const onStockChange = (event, stock: Stock[], reason, item) => {
    switch (reason) {
      case 'selectOption':
        if (
          input.stocks.filter((data) => data.id === item.option.id)
            .length > 0
        ) {
          toast.error('이미 있는 종목입니다.');
          return;
        }
        setNewStocks([...newStocks, item.option]);
        break;
      case 'removeOption':
        let newData = [...newStocks];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        newData = newData.filter(
          (stocks) => stocks.id !== item.option.id,
        );
        setNewStocks(newData);
        break;
      case 'clear':
        setNewStocks([]);
        break;
    }
  };

  // * 종목 관련
  const getStockList = useCallback(() => {
    return APIStock.getSimpleList();
  }, []);
  const [{ data: stockList, loading: stockLoading }, refetchStock] =
    useAsync<any>(getStockList, [], []);
  const handleStockChange = _.debounce(refetchStock, 300);

  //* 태그 관련
  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    const search = { _q: value, _limit: 25 };
    return APITag.getTagList(search);
  }, []);
  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [], []);
  const handleTagChange = _.debounce(refetchTag, 300);
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h4">키워드 작성</Typography>
      {keywordId !== 0 && (
        <Card sx={{ my: 2, p: 2 }}>
          <Box>
            <Typography
              sx={{ mb: 1 }}
              variant="subtitle1"
              fontWeight={700}
            >
              해당 키워드를 다른 키워드의 Alias로 추가하기
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography variant="h6">{input?.name}</Typography>
              <ArrowRightAlt sx={{ mx: 4 }} />
              <Autocomplete
                sx={{ width: 300 }}
                autoHighlight
                options={tagList}
                onChange={handleKeywordChange}
                getOptionLabel={(option) => {
                  // console.log(option);
                  const label = option?.name;

                  return label;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={handleTagChange}
                    inputRef={tagInput}
                    fullWidth
                    label="키워드"
                    name="keyword"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {tagLoading && (
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
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => setOpenModal(true)}
              >
                저장
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      <Card sx={{ my: 2, p: 2 }}>
        <Box>
          <Typography
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            키워드 이름
          </Typography>
          <TextField
            fullWidth
            id="name"
            placeholder="키워드 이름"
            label="키워드 이름"
            value={input.name}
            onChange={handleChangeInput}
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            요약문
          </Typography>
          <TextField
            id="summary"
            label="키워드 요약문"
            fullWidth
            placeholder="요약문"
            value={input.summary}
            onChange={handleChangeInput}
          />
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            설명문
          </Typography>
          <TextField
            id="description"
            fullWidth
            label="키워드 설명 (multiline)"
            multiline
            type="a"
            placeholder="설명문"
            value={input.description}
            onChange={handleChangeInput}
          />
        </Box>
        <Box>
          <Typography
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            기존 종목
          </Typography>
          <Typography
            color="textSecondary"
            fontSize={14}
            sx={{ my: 1 }}
          >
            종목 클릭시 키워드 최신성은 바로 업데이트 되며, 삭제 및
            추가는 저장을 해야 업데이트 됩니다.
          </Typography>
          {Array.isArray(input.stocks) &&
            input.stocks.length > 0 &&
            input.stocks
              .sort((a, b) =>
                a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
              )
              .map((data, i) => (
                <Chip
                  key={i}
                  color={
                    updateStocks.includes(data.code)
                      ? 'warning'
                      : 'primary'
                  }
                  label={data.name}
                  onDelete={() => {
                    handleDeleteStocks(data);
                  }}
                  onClick={() => updateStockKeyword(data)}
                  sx={{
                    mr: 1,
                    mb: 1,
                    cursor: 'pointer',
                  }}
                  variant="outlined"
                />
              ))}
          <Divider sx={{ my: 2 }} />
          <Typography
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            종목 추가
          </Typography>
          <Autocomplete
            multiple
            fullWidth
            autoHighlight
            options={stockList}
            value={newStocks}
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
                        <CircularProgress color="inherit" size={20} />
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
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            기존 Alias
          </Typography>
          {Array.isArray(input.tag_aliases) &&
            input.tag_aliases.length > 0 &&
            input.tag_aliases
              .sort((a, b) =>
                a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
              )
              .map((data, i) => (
                <Chip
                  key={i}
                  color={'success'}
                  label={data.name}
                  onDelete={() => {
                    handleDeleteAliases(data.name);
                  }}
                  sx={{
                    cursor: 'pointer',
                    ':first-of-type': {
                      mr: 1,
                      mb: 1,
                    },
                    '& + &': {
                      mr: 1,
                      mb: 1,
                    },
                  }}
                  variant="outlined"
                />
              ))}
        </Box>
        <Divider />
        <Box sx={{ my: 2 }}>
          <Typography
            sx={{ mb: 1 }}
            variant="subtitle1"
            fontWeight={700}
          >
            Alias 추가
          </Typography>
          {Array.isArray(newAliases) &&
            newAliases.length > 0 &&
            newAliases.map((data, i) => (
              <Chip
                key={i}
                color={'success'}
                label={data}
                onDelete={() => {
                  handleRemoveAliase(data);
                }}
                sx={{
                  cursor: 'pointer',
                  ':first-of-type': {
                    mr: 1,
                    mb: 1,
                  },
                  '& + &': {
                    mr: 1,
                    mb: 1,
                  },
                }}
                variant="outlined"
              />
            ))}
        </Box>
        <Box display={'flex'} alignItems="center">
          <TextField
            label="enter를 눌러도 추가됩니다."
            onChange={(e) => {
              setAlias(e.target.value);
            }}
            value={alias}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddAliase();
              }
            }}
          />
          <Button
            variant="contained"
            sx={{ ml: 2 }}
            onClick={handleAddAliase}
          >
            추가하기
          </Button>
        </Box>
        <Box display="flex" justifyContent={'end'} sx={{ mt: 2 }}>
          {keywordId !== 0 && (
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              color="error"
              onClick={deleteKeyword}
            >
              삭제
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              keywordId === 0 ? createKeyword() : updateKeywordInfo();
            }}
          >
            저장하기
          </Button>
        </Box>
      </Card>
      <Dialog
        aria-labelledby="ConfirmModal"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ConfirmModal
          title={
            'Alias로 추가할 경우 기존 키워드 정보는 모두 삭제 됩니다.'
          }
          content={`해당 키워드를 ${input?.name}의 Alias로 추가하시겠습니까?`}
          confirmTitle={`추가`}
          type={'CONFIRM'}
          handleOnClick={combineKeyword}
          handleOnCancel={() => {
            setOpenModal(false);
          }}
        />
      </Dialog>
    </Box>
  );
}
