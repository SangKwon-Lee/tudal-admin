import type { FC } from 'react';
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
  Container,
} from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import LockIcon from '../../../icons/Lock';
import UserIcon from '../../../icons/User';
import Label from '../../widgets/Label';
import type { Hiddenbox } from '../../../types/hiddenbox';
import moment from 'moment';
import { Viewer } from '@toast-ui/react-editor';

interface HiddenboxProductDetails {
  hiddenbox: Hiddenbox;
}

const MarkdownWrapper = experimentalStyled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  '& h2': {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: theme.typography.h2.lineHeight,
    marginBottom: theme.spacing(3),
  },
  '& h3': {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: theme.typography.h3.lineHeight,
    marginBottom: theme.spacing(3),
  },
  '& p': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(2),
  },
  '& li': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(1),
  },
}));

const HiddenboxProductDetails: FC<HiddenboxProductDetails> = (
  props,
) => {
  const { hiddenbox, ...other } = props;
  console.log('hiddenbox', hiddenbox);
  let productMode = 'beforeSale';
  let productModeDisplay = '';
  if (moment().diff(moment(hiddenbox.startDate)) < 0) {
    productMode = 'beforeSale';
    productModeDisplay = '판매 전';
  } else if (
    moment().diff(moment(hiddenbox.startDate)) > 0 &&
    moment().diff(moment(hiddenbox.endDate)) < 0
  ) {
    productMode = 'onSale';
    productModeDisplay = '판매 중';
  } else if (
    moment().diff(moment(hiddenbox.endDate)) > 0 &&
    moment().diff(moment(hiddenbox.publicDate)) < 0
  ) {
    productMode = 'afterSale';
    productModeDisplay = '판매 완료';
  } else {
    productMode = 'public';
    productModeDisplay = '공개';
  }

  return (
    <Card {...other}>
      <CardHeader title="히든박스 상품정보" />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                상품명
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {hiddenbox.title}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                판매 상태
              </Typography>
            </TableCell>
            <TableCell>
              <Label
                color={productMode === 'onSale' ? 'success' : 'error'}
              >
                {productModeDisplay}
              </Label>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                작성자
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {`${hiddenbox.author.nickname}(${hiddenbox.author.email})`}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                상품설명
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {hiddenbox.description}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                상품 가격
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {hiddenbox.productId}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                판매일
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {`${moment(hiddenbox.startDate).format(
                  'YYYY년 M월 D일 HH:mm',
                )} - ${moment(hiddenbox.endDate).format(
                  'YYYY년 M월 D일 HH:mm',
                )}`}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                공개일
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {`${moment(hiddenbox.publicDate).format(
                  'YYYY년 M월 D일 HH:mm',
                )}`}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                종목
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {hiddenbox.stocks.map(
                  (stock) => `${stock.name}(${stock.code})\n`,
                )}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography color="textPrimary" variant="subtitle2">
                태그
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                {hiddenbox.tags.map((tag) => `#${tag.name} `)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        sx={{
          alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Typography color="textPrimary" variant="subtitle2">
          리포트 내용
        </Typography>
        <Box sx={{ py: 3 }}>
          <Container maxWidth="md">
            <Viewer initialValue={hiddenbox.contents} />
          </Container>
        </Box>
      </Box>
    </Card>
  );
};

export default HiddenboxProductDetails;
