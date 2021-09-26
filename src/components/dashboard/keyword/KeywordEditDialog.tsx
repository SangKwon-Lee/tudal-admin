import React, { useState, useRef, useCallback } from 'react';
import * as _ from 'lodash';

import {
  CircularProgress,
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { createFilterOptions } from '@material-ui/core/Autocomplete';
import useAsync from 'src/hooks/useAsync';

import { Tag } from 'src/types/schedule';
import { APITag } from 'src/lib/api';

interface KeywordEditDialogProps {
  tag: Tag;
  open: boolean;
  setClose: () => void;
  updateTag: (id: number, name: object) => void;
  reload: () => void;
}
const customFilter = createFilterOptions<any>();

const KeywordEditDialog: React.FC<KeywordEditDialogProps> = ({
  tag,
  open,
  setClose,
  updateTag,
  reload,
}) => {
  const [keyword, setKeyword] = useState<string>(tag.name);
  const tagInput = useRef(null);
  const getTagList = useCallback(() => {
    const value = tagInput.current ? tagInput.current.value : '';
    return APITag.getList(value);
  }, [tagInput]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [tagInput], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  const onSubmit = async () => {
    updateTag(tag.id, { name: keyword });
  };

  return (
    <Dialog
      open={open}
      onClose={setClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">키워드 수정</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {tag.name}을 수정합니다.
        </DialogContentText>
        <Autocomplete
          freeSolo
          value={keyword}
          clearOnBlur
          handleHomeEndKeys
          options={tagList}
          style={{ width: 500, marginRight: 10 }}
          onChange={(event, newValue) => {
            if (!newValue) {
              setKeyword(null);
              return;
            }
            if (typeof newValue !== 'string') {
              console.log(newValue);
              if (newValue && newValue.isNew && newValue.inputValue) {
                setKeyword(newValue.inputValue);
              }
            }
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.isNew) {
              return option.name;
            }
            return option.name;
          }}
          filterOptions={(options, params) => {
            const filtered = customFilter(options, params);

            if (params.inputValue !== '') {
              filtered.push({
                id: Math.random(),
                isNew: true,
                name: `"${tag.name}" -> "${params.inputValue}"`,
                inputValue: params.inputValue,
              });
            }

            return filtered;
          }}
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
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={setClose} color="primary">
          취소
        </Button>
        <Button onClick={onSubmit} color="primary">
          수정
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KeywordEditDialog;
