import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import { subDays, subHours } from 'date-fns';
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Pagination,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@material-ui/core';
import Label from 'src/components/widgets/Label';
import Scrollbar from '../../layout/Scrollbar';
import ArrowRightIcon from '../../../icons/ArrowRight';
import ImageIcon from '../../../icons/Image';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import { IHRImage } from 'src/types/hiddenreport';
import {
  HRImageListActionKind,
  IHRimageListAction,
  IHRImageListState,
  sortOptions,
} from './HiddenreportImageList.Conatiner';
import dayjs from 'dayjs';

const getLabel = (text) => {
  return <Label color={'success'}>{text}</Label>;
};

interface HiddenreportImageListPresenterProps {
  state: IHRImageListState;
  dispatch: (param: IHRimageListAction) => void;
}

const HiddenreportImageListPresenter: FC<HiddenreportImageListPresenterProps> =
  ({ state, dispatch }) => {
    const { list } = state;
    return (
      <Box
        sx={{
          backgroundColor: 'background.default',
          pt: 3,
        }}
      >
        <Card>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              m: -1,
              p: 2,
            }}
          >
            <Box
              sx={{
                m: 1,
                maxWidth: '100%',
                width: 500,
              }}
            >
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                placeholder="키워드, 이름 검색"
                variant="outlined"
                onChange={(e) => {
                  dispatch({
                    type: HRImageListActionKind.CHANGE_QUERY,
                    payload: { value: e.target.value, name: '_q' },
                  });
                }}
              />
            </Box>
            <Box
              sx={{
                m: 1,
                maxWidth: '100%',
                width: 240,
              }}
            >
              <TextField
                label="Sort By"
                name="_sort"
                select
                SelectProps={{ native: true }}
                variant="outlined"
                onChange={(e) => {
                  dispatch({
                    type: HRImageListActionKind.CHANGE_QUERY,
                    payload: { value: e.target.value, name: '_sort' },
                  });
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
          </Box>
          <Scrollbar>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>메인 이미지</TableCell>
                    <TableCell>이름</TableCell>
                    <TableCell>키워드</TableCell>
                    <TableCell>생성일</TableCell>
                    <TableCell>수정</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((image) => (
                    <TableRow hover key={image.id}>
                      <TableCell>{image.id}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          {image.thumbnailImageUrl ? (
                            <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: 'background.default',
                                display: 'flex',
                                height: 100,
                                justifyContent: 'center',
                                overflow: 'hidden',
                                width: 100,
                                '& img': {
                                  height: 'auto',
                                  width: '100%',
                                },
                              }}
                            >
                              <img
                                alt="Product"
                                src={image.thumbnailImageUrl}
                              />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                alignItems: 'center',
                                backgroundColor: 'background.default',
                                display: 'flex',
                                height: 100,
                                justifyContent: 'center',
                                width: 100,
                              }}
                            >
                              <ImageIcon fontSize="small" />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{image.name}</TableCell>
                      <TableCell>{getLabel(image.keyword)}</TableCell>
                      <TableCell>
                        {dayjs(image.created_at).format('YYYY-MM-DD')}
                      </TableCell>

                      <TableCell>
                        <IconButton>
                          <Link
                            color="textPrimary"
                            component={RouterLink}
                            to={`/dashboard/hiddenreports/images/${image.id}/edit`}
                            variant="subtitle2"
                          >
                            <PencilAltIcon fontSize="small" />
                          </Link>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                variant="outlined"
                count={Math.ceil(
                  state.listLength / state.query._limit,
                )}
                onChange={(event, page) => {
                  dispatch({
                    type: HRImageListActionKind.CHANGE_PAGE,
                    payload: page,
                  });
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            </Box>
          </Scrollbar>
        </Card>
      </Box>
    );
  };

export default HiddenreportImageListPresenter;
