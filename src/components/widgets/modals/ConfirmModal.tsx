import type { FC } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/WarningOutlined';

interface ConfirmModalProps {
  title: string;
  content: string;
  confirmTitle: string;
  handleOnClick: () => void;
  handleOnCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const { title, content, confirmTitle, handleOnClick, handleOnCancel} = props;

  return (
    <Box
        sx={{
        backgroundColor: 'transparent',
        minHeight: '100%',
        }}
    >
        <Container maxWidth="sm">
            <Box
            sx={{
                display: 'flex',
                pb: 2,
                pt: 3,
                px: 3
            }}
            >
            <Avatar
                sx={{
                backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                color: 'error.main',
                mr: 2
                }}
            >
                <WarningIcon />
            </Avatar>
            <Box>
                <Typography
                color="textPrimary"
                variant="h5"
                >
                {title}
                </Typography>
                <Typography
                color="textSecondary"
                sx={{ mt: 1 }}
                variant="body2"
                >
                {content}
                </Typography>
            </Box>
            </Box>
            <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                px: 3,
                py: 1.5
            }}
            >
            <Button
                color="primary"
                sx={{ mr: 2 }}
                variant="outlined"
                onClick={handleOnCancel}
            >
                취소
            </Button>
            <Button
                sx={{
                backgroundColor: 'error.main',
                '&:hover': {
                    backgroundColor: 'error.dark'
                }
                }}
                variant="contained"
                onClick={handleOnClick}
            >
                {confirmTitle}
            </Button>
            </Box>
        
        </Container>
    </Box>
  )
};

export default ConfirmModal;
