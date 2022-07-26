import {
  Card,
  Divider,
  Box,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Pagination,
  Dialog,
  Link,
} from '@material-ui/core';
import dayjs from 'dayjs';
import Scrollbar from 'src/components/layout/Scrollbar';
import ConfirmModal from 'src/components/widgets/modals/ConfirmModal';
import ArrowRightIcon from 'src/icons/ArrowRight';
import TrashIcon from 'src/icons/Trash';
import SearchIcon from 'src/icons/Search';
import { Link as RouterLink } from 'react-router-dom';
import {
  TestListAction,
  TestListActionKind,
  TestListState,
} from './TestList.Container';

interface TestListProps {
  testListState: TestListState;
  dispatch: (params: TestListAction) => void;
  // handleDelete: () => Promise<void>;
}

const TestListPresenter: React.FC<TestListProps> = ({
  dispatch,
  testListState,
}) => {
  const { loading, query, list, listLength } = testListState;
  return (
    <>
      <Card>
        <Box
          sx={{
            p: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            id="search"
            InputProps={{
              // * 'data-testid': 'search-1231231', this is legacy portion. Ask 상권.
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>제목</TableCell>
                <TableCell>링크</TableCell>
                <TableCell>등록일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody></TableBody>
            <Pagination count={10} />
          </Table>
        </Box>
      </Card>
    </>
  );
};

export default TestListPresenter;
