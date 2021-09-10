import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface EditTextDialogProps {
  title: string;
  open: boolean;
  isMultiLine: boolean;
  description?: string;
  defaultText?: string;
  onSubmit: (_text) => void;
  setOpen: (isOpen: boolean) => void;
}

const EditTextDialog: React.FC<EditTextDialogProps> = ({
  title,
  description,
  isMultiLine,
  open,
  setOpen,
  defaultText,
  onSubmit,
}) => {
  const [_text, _setText] = React.useState<string>(
    defaultText ? defaultText : '',
  );
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const _onSubmit = () => {
    onSubmit(_text);
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText>{description}</DialogContentText>
        )}
        <TextField
          autoFocus
          value={_text}
          onChange={(e) => _setText(e.target.value)}
          multiline={isMultiLine}
          label={title}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          취소
        </Button>
        <Button
          onClick={() => {
            handleClose();
            _onSubmit();
          }}
          color="primary"
        >
          제출
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditTextDialog;
