import { useState } from 'react';
import * as _ from 'lodash';
import type { FC } from 'react';
import {
  Box,
  Chip,
  Divider,
  Input,
  Dialog,
  Button,
} from '@material-ui/core';
import SearchIcon from 'src/icons/Search';

interface DialogEditMultiSelectProps {
  options: any[];
  isOpen: boolean;
  id: string;
  name: string;
  handleOpen: (isOpen: boolean) => void;
  handleCreate: (name: string) => void;
  handleDelete: (option: any) => void;
}

const DialogEditMultiSelect: FC<DialogEditMultiSelectProps> = (
  props,
) => {
  const {
    options,
    isOpen,
    id,
    name,
    handleOpen,
    handleCreate,
    handleDelete,
  } = props;
  const [input, setInput] = useState<string>('');

  const _handleCreate = async () => {
    await handleCreate(input);
    setInput('');
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={() => handleOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          minHeight: '100%',
          p: 3,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            p: 2,
          }}
        >
          <SearchIcon fontSize="small" />
          <Box
            sx={{
              flexGrow: 1,
              ml: 3,
            }}
          >
            <Input
              value={input}
              disableUnderline
              fullWidth
              placeholder="텍스트 입력"
              onChange={(e) => setInput(e.target.value)}
            />
          </Box>
          <Button onClick={_handleCreate}>등록</Button>
        </Box>
        <Divider />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            p: 2,
          }}
        >
          {!_.isEmpty(options) &&
            options.map((option) => (
              <Chip
                key={option[id]}
                label={option[name]}
                onDelete={() => handleDelete(option)}
                sx={{ m: 1 }}
                variant="outlined"
              />
            ))}
        </Box>
        <Divider />
      </Box>
    </Dialog>
  );
};

export default DialogEditMultiSelect;
