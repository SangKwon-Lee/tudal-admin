import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, TextField } from '@material-ui/core';
import { createColumn } from '../../../slices/kanban';
import { useDispatch } from '../../../store';

const KanbanColumnAdd: FC = (props) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleAddInit = (): void => {
    setIsExpanded(true);
  };

  const handleAddCancel = (): void => {
    setIsExpanded(false);
    setName('');
  };

  const handleAddConfirm = async (): Promise<void> => {
    try {
      await dispatch(createColumn(name || 'Untitled column'));
      setIsExpanded(false);
      setName('');
      enqueueSnackbar('Column created', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        variant: 'success'
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        variant: 'error'
      });
    }
  };

  return (
    <div {...props}>
      <Card
        sx={{
          mx: 1,
          width: {
            sm: 380,
            xs: 300
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {
            isExpanded
              ? (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    name="listName"
                    onChange={handleChange}
                    value={name}
                    variant="outlined"
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 2
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={handleAddCancel}
                      variant="text"
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleAddConfirm}
                      variant="contained"
                    >
                      Add
                    </Button>
                  </Box>
                </>
              )
              : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Button
                    color="primary"
                    onClick={handleAddInit}
                    variant="text"
                  >
                    Add Column
                  </Button>
                </Box>
              )
          }
        </Box>
      </Card>
    </div>
  );
};

export default KanbanColumnAdd;
