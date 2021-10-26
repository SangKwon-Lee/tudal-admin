import React from 'react';
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

import { Category, Tag } from 'src/types/schedule';
import toast from 'react-hot-toast';

interface CategoryEditDialogProps {
  categoryRef: React.MutableRefObject<any>;
  category: Category;
  open: boolean;
  setClose: () => void;
  tagList: Tag[];
  handleTagChange: _.DebouncedFunc<() => void>;
  tagLoading: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => Promise<void>;
}
const customFilter = createFilterOptions<any>();

const CategoryEditDialogPresenter: React.FC<CategoryEditDialogProps> =
  ({
    category,
    open,
    setClose,
    categoryRef,
    tagList,
    handleTagChange,
    setInput,
    input,
    onSubmit,
    tagLoading,
  }) => {
    return (
      <Dialog
        open={open}
        onClose={setClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          카테고리 수정
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{category.name}"을 수정합니다.
          </DialogContentText>
          <Autocomplete
            freeSolo
            value={input}
            clearOnBlur
            handleHomeEndKeys
            options={tagList}
            style={{ width: 500, marginRight: 10, marginTop: 25 }}
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
                  name: `"${category.name}" -> "${params.inputValue}"`,
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
                label="카테고리"
                name="category"
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

export default CategoryEditDialogPresenter;
