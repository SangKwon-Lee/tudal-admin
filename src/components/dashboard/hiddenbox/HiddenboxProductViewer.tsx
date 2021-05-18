import type { FC } from 'react';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Container
} from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import LockIcon from '../../../icons/Lock';
import UserIcon from '../../../icons/User';
import Label from '../../Label';
import type { Hiddenbox } from '../../../types/hiddenbox';
import moment from 'moment';
import Markdown from 'react-markdown/with-html';
import { Viewer } from '@toast-ui/react-editor';
//import '@toast-ui/editor/dist/toastui-editor.css';

interface HiddenboxProductViewer {
  hiddenbox: Hiddenbox
}

const HiddenboxProductViewer: FC<HiddenboxProductViewer> = (props) => {
  const { hiddenbox, ...other } = props;
  const viewer = useRef(null);

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
        >
          {hiddenbox.title}
        </Typography>
        <Typography
          variant="h6"
          style={{ textAlign: 'right' }}
        >
          {hiddenbox.author.nickname}
        </Typography>
        <Viewer
          ref={viewer}
          initialValue={hiddenbox.contents}
        />
      </Container>
    </Box>    
  );
};

export default HiddenboxProductViewer;
