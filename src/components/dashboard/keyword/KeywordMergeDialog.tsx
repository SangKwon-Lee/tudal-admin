import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import * as _ from 'lodash';

import {
  CircularProgress,
  Autocomplete,
  Button,
  Box,
  TextField,
  List,
  ListItemText,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from '@material-ui/core';
import useAsync from 'src/hooks/useAsync';

import { Tag } from 'src/types/schedule';
import { APITag } from 'src/lib/api';
import toast from 'react-hot-toast';

const STEPS = { SELECT_CANDIDATES: 0, CONFIRM_MERGE: 1 };
const SUBTITLE = {
  0: '한번에 최대 2개까지 통합이 가능합니다.',
  1: '통합할 키워드를 선택해주세요',
};
const calculateMoreRelations = (obj) => {
  let total = 0;
  let id = null;
  for (const key in obj) {
    const tag = obj[key];
    if (tag.total >= total) {
      id = key;
      total = tag.total;
    }
  }
  return id;
};

interface KeywordMergeDialogProps {
  isOpen: boolean;
  setClose: () => void;
  reload: () => void;
}
const KeywordMergeDialog: React.FC<KeywordMergeDialogProps> = ({
  isOpen,
  setClose,
  reload,
}) => {
  const [step, setStep] = useState<number>(STEPS.SELECT_CANDIDATES);
  const [candidates, setCandidates] = useState<Tag[]>([]);
  const [relations, setRelations] = useState(null);
  const [mergeItems, setMergeItems] = useState({
    from: null,
    to: null,
  });
  const tagInput = useRef(null);
  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList({ _q: value });
  }, [tagInput]);

  const handleCandidates = (candidate) => {
    setCandidates((prev) => {
      if (prev.length === 2) {
        return [prev[1], candidate];
      }
      return [...prev, candidate];
    });
  };

  const handleStep = () => {
    if (step === STEPS.CONFIRM_MERGE) {
      handleSubmit();
    }
    setStep((prev) => prev + 1);
  };

  const handleCheck = useCallback(
    (id: string) => {
      const to = parseInt(id);
      const from = candidates.filter((tag) => tag.id !== to)[0].id;
      setMergeItems({ to, from });
    },
    [candidates],
  );

  const getRelations = useCallback(async () => {
    try {
      const candidatesIds = candidates.map((el) => el.id);
      const { data, status } = await APITag.findRelations(
        candidatesIds,
      );
      if (status === 200) {
        const hasMoreRelationship = calculateMoreRelations(data);
        setRelations(data);
        handleCheck(hasMoreRelationship);
      }
    } catch (error) {
      toast.error(
        '키워드 정보 불러오기에 실패했습니다. 지속해서 발생할 시 관리자에게 문의해주세요',
      );
      setClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidates, handleCheck]);

  const handleSubmit = async () => {
    try {
      const { data, status } = await APITag.merge(mergeItems);
      if (status === 200 && data.success) {
        toast.success(
          `총 ${data.numOfChanged}개의 데이터가 변경되었습니다.`,
        );
        setClose();
        reload();
      }
    } catch (error) {
      toast.success(error.message);
    }
  };

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  useEffect(() => {
    if (step === STEPS.CONFIRM_MERGE) {
      getRelations();
    }
  }, [step, getRelations]);

  if (step > STEPS.CONFIRM_MERGE) {
    return <CircularProgress />;
  } else {
    return (
      <Dialog
        open={isOpen}
        onClose={setClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>키워드 통합</DialogTitle>
        <DialogContent>
          <Typography>{SUBTITLE[step]}</Typography>
          <Box
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              width: '100%',
              minWidth: 500,
            }}
          >
            {step === STEPS.SELECT_CANDIDATES && (
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                }}
              >
                {candidates.map((tag) => {
                  return (
                    <ListItemText
                      key={tag.id}
                      primary={`- ${tag.name}`}
                      secondary={`요약문 : ${
                        tag.summary
                          ? tag.summary
                          : '존재하지 않습니다'
                      }`}
                      style={{
                        whiteSpace: 'pre-wrap',
                        overflowY: 'scroll',
                      }}
                    />
                  );
                })}
              </List>
            )}
            {step === STEPS.CONFIRM_MERGE &&
              relations &&
              candidates.map((tag) => {
                const {
                  stocks,
                  schedules,
                  themes,
                  news,
                  hiddenboxes,
                  aliases,
                } = relations[tag.id];
                return (
                  <Box
                    key={tag.id}
                    sx={{
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 21, mb: 1.5 }}
                      >
                        {tag?.name}
                      </Typography>
                      <Typography variant="body2">
                        종목: {stocks}
                        <br />
                        일정: {schedules}
                        <br />
                        테마: {themes}
                        <br />
                        뉴스: {news}
                        <br />
                        히든박스: {hiddenboxes}
                        <br />
                        alias: {aliases}
                        <br />
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Checkbox
                        size="small"
                        value={tag.id}
                        checked={tag.id === mergeItems.to}
                        onChange={(event) =>
                          handleCheck(event.target.value)
                        }
                      ></Checkbox>
                    </CardActions>
                  </Box>
                );
              })}
          </Box>
          {step === STEPS.SELECT_CANDIDATES && (
            <Autocomplete
              freeSolo
              clearOnBlur
              handleHomeEndKeys
              options={tagList}
              style={{ width: 500, marginRight: 10 }}
              onChange={(event, newValue) => {
                if (typeof newValue !== 'string' && newValue) {
                  handleCandidates(newValue);
                }
              }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={handleTagChange}
                  fullWidth
                  label="키워드"
                  name="keyword"
                  variant="outlined"
                  inputRef={tagInput}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {tagLoading && (
                          <CircularProgress
                            color="inherit"
                            size={20}
                          />
                        )}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={setClose} color="primary">
            취소
          </Button>
          <Button onClick={handleStep} color="primary">
            수정
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default KeywordMergeDialog;
