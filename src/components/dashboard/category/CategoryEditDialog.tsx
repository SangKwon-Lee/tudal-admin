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

import { Category, Tag } from 'src/types/schedule';
import { APICategory, APITag } from 'src/lib/api';
import toast from 'react-hot-toast';

interface CategoryEditDialogProps {
  category: Category;
  open: boolean;
  setClose: () => void;
  update: (id: number, name: object) => void;
  reload: () => void;
}
const customFilter = createFilterOptions<any>();

const CategoryEditDialog: React.FC<CategoryEditDialogProps> = ({
  category,
  open,
  setClose,
  update,
  reload,
}) => {
  const [input, setInput] = useState<string>(category.name);
  const categoryRef = useRef(null);
  const getTagList = useCallback(() => {
    const value = categoryRef.current
      ? categoryRef.current.value
      : '';
    return APICategory.getList(value);
  }, [categoryRef]);

  const [{ data: tagList, loading: tagLoading }, refetchTag] =
    useAsync<Tag[]>(getTagList, [categoryRef], []);

  const handleTagChange = _.debounce(refetchTag, 300);

  const onSubmit = async () => {
    update(category.id, { name: input });
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
          {category.name}을 수정합니다.
        </DialogContentText>
        <Autocomplete
          freeSolo
          value={input}
          clearOnBlur
          handleHomeEndKeys
          options={tagList}
          style={{ width: 500, marginRight: 10 }}
          onChange={(event, newValue) => {
            if (!newValue) {
              setInput(null);
              return;
            }
            if (typeof newValue !== 'string') {
              if (newValue.isNew) {
                setInput(newValue.inputValue);
              } else {
                toast.error('중복된 카테고리 입니다.');
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
                name: `"${category.name}" =>"${params.inputValue}"`,
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
              inputRef={categoryRef}
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

export default CategoryEditDialog;
