// import { useState, useEffect } from 'react';
// import type { FC, ChangeEvent } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
// import moment from 'moment';
// import PropTypes from 'prop-types';
// import {
//   Box,
//   Button,
//   Card,
//   Checkbox,
//   Divider,
//   IconButton,
//   LinearProgress,
//   InputAdornment,
//   Link,
//   Tab,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   Tabs,
//   TextField,
//   Typography,
//   Dialog,
// } from '@material-ui/core';
// import ArrowRightIcon from '../../../icons/ArrowRight';
// import PencilAltIcon from '../../../icons/PencilAlt';
// import SearchIcon from '../../../icons/Search';
// import ChatIcon from '../../../icons/ChatAlt';
// import type { Hiddenbox } from '../../../types/hiddenbox';
// import Scrollbar from '../../layout/Scrollbar';
// import axios, { CMSURL } from '../../../lib/axios';
// import ConfirmModal from '../../../components/widgets/modals/ConfirmModal';
// import { SocialPostComment, SocialPostCommentAdd } from '../social';
// import {
//   applyFilters,
//   applyPagination,
//   applySort,
// } from '../../../utils/sort';
// import useAuth from 'src/hooks/useAuth';

// const HiddenReportList: React.FC = (props) => {
//   return(
//   <>
//       <Card {...other}>
//         <Tabs
//           indicatorColor="primary"
//           onChange={handleTabsChange}
//           scrollButtons="auto"
//           textColor="primary"
//           value={currentTab}
//           variant="scrollable"
//         >
//           {tabs &&
//             tabs.map((tab) => (
//               <Tab
//                 key={tab.value}
//                 label={tab.label}
//                 value={tab.value}
//               />
//             ))}
//         </Tabs>
//         <Divider />
//         <Box
//           sx={{
//             alignItems: 'center',
//             display: 'flex',
//             flexWrap: 'wrap',
//             m: -1,
//             p: 2,
//           }}
//         >
//           <Box
//             sx={{
//               m: 1,
//               maxWidth: '100%',
//               width: 500,
//             }}
//           >
//             <TextField
//               fullWidth
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon fontSize="small" />
//                   </InputAdornment>
//                 ),
//               }}
//               onChange={handleQueryChange}
//               placeholder="히든박스 검색"
//               value={query}
//               variant="outlined"
//             />
//           </Box>
//           <Box
//             sx={{
//               mx: 1,
//             }}
//           >
//             <TextField
//               label="정렬"
//               name="sort"
//               onChange={handleSortChange}
//               select
//               SelectProps={{ native: true }}
//               value={sort}
//               variant="outlined"
//               sx={{ mx: 1 }}
//             >
//               {sortOptions &&
//                 sortOptions.map((option, index) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//             </TextField>
//           </Box>
//         </Box>
//         {enableBulkActions && (
//           <Box sx={{ position: 'relative' }}>
//             <Box
//               sx={{
//                 backgroundColor: 'background.paper',
//                 // position: 'absolute',
//                 px: '4px',
//                 width: '100%',
//                 zIndex: 2,
//               }}
//             >
//               {/* <Checkbox
//             checked={selectedAllHiddenboxes}
//             color="primary"
//             indeterminate={selectedSomeHiddenboxes}
//             onChange={handleSelectAllHiddenboxes}
//           /> */}
//               <Button
//                 color="primary"
//                 sx={{ ml: 2 }}
//                 variant="outlined"
//                 onClick={onClickDelete}
//               >
//                 삭제
//               </Button>
//               <Button
//                 color="primary"
//                 sx={{ ml: 2 }}
//                 variant="outlined"
//                 component={RouterLink}
//                 to={`/dashboard/hiddenboxes/${selectedHiddenboxes[0]}/edit`}
//               >
//                 수정
//               </Button>
//             </Box>
//           </Box>
//         )}
//         <Scrollbar>
//           <Box sx={{ minWidth: 700 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell padding="checkbox"></TableCell>
//                   <TableCell>상품명</TableCell>
//                   <TableCell>판매일</TableCell>
//                   <TableCell>공개일</TableCell>
//                   <TableCell>가격</TableCell>
//                   <TableCell>판매량</TableCell>
//                   <TableCell>좋아요</TableCell>
//                   <TableCell>조회수</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedHiddenboxes.map((hiddenbox) => {
//                   const isHiddenboxSelected =
//                     selectedHiddenboxes.includes(hiddenbox.id);
//                   return (
//                     <TableRow
//                       hover
//                       key={hiddenbox.id}
//                       selected={isHiddenboxSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isHiddenboxSelected}
//                           color="primary"
//                           onChange={(event) =>
//                             handleSelectOneHiddenbox(
//                               event,
//                               hiddenbox.id,
//                             )
//                           }
//                           value={isHiddenboxSelected}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Box
//                           sx={{
//                             alignItems: 'center',
//                             display: 'flex',
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               ml: 1,
//                               maxWidth: '150px',
//                               wordBreak: 'break-all',
//                             }}
//                           >
//                             <Link
//                               color="inherit"
//                               component={RouterLink}
//                               to={`/dashboard/hiddenboxes/${hiddenbox.id}`}
//                               variant="subtitle2"
//                             >
//                               {hiddenbox.title}
//                             </Link>
//                             <Typography
//                               color="textSecondary"
//                               variant="body2"
//                             >
//                               {hiddenbox.author &&
//                                 hiddenbox.author.nickname}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </TableCell>
//                       <TableCell
//                         style={{
//                           maxWidth: '190px',
//                           minWidth: '190px',
//                         }}
//                       >
//                         {`${moment(hiddenbox.startDate).format(
//                           'YYYY년 M월 D일 HH:mm',
//                         )}-${moment(hiddenbox.endDate).format(
//                           'YYYY년 M월 D일 HH:mm',
//                         )}`}
//                       </TableCell>
//                       <TableCell
//                         style={{
//                           minWidth: '185px',
//                         }}
//                       >
//                         {moment(hiddenbox.publicDate).format(
//                           'YYYY년 M월 D일 HH:mm',
//                         )}
//                       </TableCell>
//                       <TableCell>{hiddenbox.productId}</TableCell>
//                       <TableCell>{hiddenbox.orders}</TableCell>
//                       <TableCell>{hiddenbox.likes.length}</TableCell>
//                       <TableCell>{hiddenbox.viewCount}</TableCell>
//                       <TableCell align="right">
//                         <IconButton
//                           onClick={() => {
//                             onClickComment(hiddenbox);
//                           }}
//                         >
//                           <ChatIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           component={RouterLink}
//                           to={`/dashboard/hiddenboxes/${hiddenbox.id}/edit`}
//                         >
//                           <PencilAltIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           component={RouterLink}
//                           to={`/dashboard/hiddenboxes/${hiddenbox.id}`}
//                         >
//                           <ArrowRightIcon fontSize="small" />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//             {!loading && (
//               <div data-testid="news-list-loading">
//                 <LinearProgress />
//               </div>
//             )}
//           </Box>
//         </Scrollbar>
//         <TablePagination
//           component="div"
//           count={filteredHiddenboxes.length}
//           onPageChange={handlePageChange}
//           onRowsPerPageChange={handleLimitChange}
//           page={page}
//           rowsPerPage={limit}
//           rowsPerPageOptions={[5, 10, 25]}
//         />
//       </Card>
//     ) : (
//       <Box>히든박스 권한이 없습니다. </Box>
//     )}

//     <Dialog
//       aria-labelledby="ConfirmModal"
//       open={open}
//       onClose={() => setOpen(false)}
//     >
//       <ConfirmModal
//         title={'정말 삭제하시겠습니까?'}
//         content={
//           '고객들이 구매한 상품의 경우 삭제시 큰 주의가 필요합니다.'
//         }
//         confirmTitle={'삭제'}
//         handleOnClick={handleDelete}
//         handleOnCancel={() => setOpen(false)}
//       />
//     </Dialog>
//     <Dialog
//       aria-labelledby="CommentModal"
//       open={commentOpen}
//       onClose={() => setCommentOpen(false)}
//     >
//       <Box
//         sx={{
//           py: 3,
//           px: 3,
//         }}
//       >
//         <Box sx={{ pb: 3, width: 700 }}>
//           <Typography color="inherit" variant="h5">
//             히든박스 코멘트
//           </Typography>
//         </Box>
//         {comments.length > 0 ? (
//           comments.map((comment) => (
//             <SocialPostComment
//               commentId={comment.id}
//               authorAvatar={
//                 comment.author.avatar
//                   ? `${CMSURL}${comment.author.avatar.url}`
//                   : ''
//               }
//               authorName={comment.author.nickname}
//               createdAt={comment.created_at}
//               key={comment.id}
//               message={comment.message}
//               handleDeleteComment={handleDeleteComment}
//               handleUpdateComment={handleUpdateComment}
//             />
//           ))
//         ) : (
//           <Box ml={3} mt={3}>
//             <Typography variant={'body1'}>
//               {'작성된 댓글이 없습니다.'}
//             </Typography>
//           </Box>
//         )}
//         <Divider sx={{ my: 2 }} />
//         <SocialPostCommentAdd
//           handleWriteComment={handleWriteComment}
//         />
//       </Box>
//     </Dialog>
//   </>
//   )
// };
