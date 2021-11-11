import { useCallback, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
} from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import ArchiveIcon from '../../../icons/Archive';
import DocumentTextIcon from '../../../icons/DocumentText';
import DotsHorizontalIcon from '../../../icons/DotsHorizontal';
import DownloadIcon from '../../../icons/Download';
import PencilAltIcon from '../../../icons/PencilAlt';
import TrashIcon from '../../../icons/Trash';
import SearchIcon from '../../../icons/Search';
import * as _ from 'lodash';
import {
  HiddenReportCreateAction,
  HiddenReportCreateActionKind,
  HiddenReportCreateState,
} from './HiddenreportCreate.Container';
import useMounted from 'src/hooks/useMounted';
import toast from 'react-hot-toast';

interface HiddenReportCreateImageFormPresenterProps {
  reportCreateState: HiddenReportCreateState;
  dispatch: (params: HiddenReportCreateAction) => void;
  getImages: (query) => void;
}
const HiddenReportCreateImageFormPresenter: FC<HiddenReportCreateImageFormPresenterProps> =
  ({ reportCreateState, dispatch, getImages }) => {
    const { loading, image, newReport } = reportCreateState;
    const { isLoadMoreAvailable } = image;

    const showAlert = useRef(true);
    const loader = useRef<HTMLDivElement | null>(null);
    const moreRef = useRef<HTMLButtonElement | null>(null);
    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const handleMenuOpen = (): void => {
      setOpenMenu(true);
    };

    const handleMenuClose = (): void => {
      setOpenMenu(false);
    };
    const onChangeSearch = _.debounce((e) => {
      const { value } = e.target;
      dispatch({
        type: HiddenReportCreateActionKind.CHANGE_SEARCH,
        payload: { name: '_q', value },
      });
      showAlert.current = true;
    }, 300);

    const handleObserver = useCallback(
      (entries) => {
        const target = entries[0];

        if (loading) return;
        if (!image.list.length) return;
        if (!isLoadMoreAvailable) {
          console.log('showAlert', showAlert);
          showAlert.current &&
            toast.success('더이상 불러올 수 없습니다.');
          showAlert.current = false;
          return;
        }
        if (target.isIntersecting) {
          dispatch({
            type: HiddenReportCreateActionKind.LOAD_MORE_IMAGE,
          });
        }
      },
      [isLoadMoreAvailable, dispatch, loading, image.list],
    );

    useEffect(() => {
      const option = {
        root: null,
        rootMargin: '5px',
        threshold: 0,
      };
      const observer = new IntersectionObserver(
        handleObserver,
        option,
      );
      if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    return (
      <>
        <>
          <Box
            sx={{
              display: 'flex',
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
                  id: 'search',
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                name="_q"
                placeholder="검색"
                variant="outlined"
                onChange={onChangeSearch}
              />
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: 'background.default',
              display: 'flex',
              justifyContent: 'center',
              minHeight: '100%',
              p: 3,
            }}
          >
            <Grid container spacing={3}>
              {image.list.map((image) => {
                const isSelected =
                  newReport.hidden_report_image?.id === image.id;
                return (
                  <Grid item key={image.id} md={4} xs={12}>
                    <Card
                      style={{
                        border: `${
                          isSelected
                            ? '3px solid rgb(69,76,199)'
                            : 'none'
                        }`,
                        boxShadow: 'none',
                      }}
                      onClick={() => {
                        dispatch({
                          type: HiddenReportCreateActionKind.CHANGE_IMAGE,
                          payload: image,
                        });
                      }}
                    >
                      {true ? (
                        <CardMedia
                          image={image.thumbnailImageUrl}
                          component="img"
                          src={image.thumbnailImageUrl}
                          sx={{
                            backgroundColor: 'background.default',
                            height: 200,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            alignItems: 'center',
                            backgroundColor: blueGrey['50'],
                            color: '#000000',
                            display: 'flex',
                            height: 140,
                            justifyContent: 'center',
                          }}
                        >
                          <DocumentTextIcon fontSize="large" />
                        </Box>
                      )}
                      <CardContent
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <Typography
                            color="textPrimary"
                            variant="subtitle2"
                          >
                            {image.id}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="caption"
                          >
                            {/* {bytesToSize(image.size)} */}
                          </Typography>
                        </div>
                        <div>
                          <Tooltip title="More options">
                            <IconButton
                              edge="end"
                              onClick={handleMenuOpen}
                              ref={moreRef}
                              size="small"
                            >
                              <DotsHorizontalIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </CardContent>
                      <Divider />
                      <CardActions>
                        <Button
                          color="primary"
                          fullWidth
                          startIcon={
                            <DownloadIcon fontSize="small" />
                          }
                          variant="text"
                        >
                          Download
                        </Button>
                      </CardActions>
                      <Menu
                        anchorEl={moreRef.current}
                        anchorOrigin={{
                          horizontal: 'left',
                          vertical: 'top',
                        }}
                        elevation={1}
                        onClose={handleMenuClose}
                        open={openMenu}
                        PaperProps={{
                          sx: {
                            maxWidth: '100%',
                            width: 250,
                          },
                        }}
                        transformOrigin={{
                          horizontal: 'left',
                          vertical: 'top',
                        }}
                      >
                        <MenuItem divider>
                          <ListItemIcon>
                            <PencilAltIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Rename" />
                        </MenuItem>
                        <MenuItem divider>
                          <ListItemIcon>
                            <TrashIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Delete" />
                        </MenuItem>
                        <MenuItem>
                          <ListItemIcon>
                            <ArchiveIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Archive" />
                        </MenuItem>
                      </Menu>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          {!loading && <div ref={loader} />}
        </>
      </>
    );
  };

export default HiddenReportCreateImageFormPresenter;
