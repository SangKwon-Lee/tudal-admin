import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import type { Hiddenbox } from '../../../types/hiddenbox';
import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';

interface HiddenboxListTableProps {
  hiddenboxes: Hiddenbox[];
}

type Sort =
  | 'updatedAt|desc'
  | 'updatedAt|asc'
  | 'orders|desc'
  | 'orders|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const tabs = [
  {
    label: '전체',
    value: 'all'
  },
  {
    label: '판매 전',
    value: 'beforeSale'
  },
  {
    label: '판매 중',
    value: 'onSale'
  },
  {
    label: '판매 완료',
    value: 'afterSale'
  },
  {
    label: '공개',
    value: 'public'
  }
];

const sortOptions: SortOption[] = [
  {
    label: '최신순',
    value: 'updatedAt|desc'
  },
  {
    label: '오래된순',
    value: 'updatedAt|asc'
  },
  {
    label: '판매량 최고',
    value: 'orders|desc'
  },
  {
    label: '판매량 최저',
    value: 'orders|asc'
  }
];

const applyFilters = (
  hiddenboxes: Hiddenbox[],
  query: string,
  filters: any
): Hiddenbox[] => hiddenboxes
  .filter((hiddenbox) => {
    let matches = true;

    if (query) {
      const properties = ['title', 'author-username'];
      let containsQuery = false;

      properties.forEach((property) => {
        if( property.indexOf('-') > -1 ){
          const strArray = property.split("-");
          if (hiddenbox[strArray[0]][strArray[1]].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        } else {
          if (hiddenbox[property].toLowerCase().includes(query.toLowerCase())) {
            containsQuery = true;
          }
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      switch(key){
        case 'beforeSale':
          if( value && moment().diff(moment(hiddenbox.startDate)) > 0 ){
            matches = false;
          } 
          break;
        case 'onSale':
          if( value && ( moment().diff(moment(hiddenbox.startDate)) < 0 || moment().diff(moment(hiddenbox.endDate)) > 0 )){
            matches = false;
          }
          break;
        case 'afterSale':
          if( value && moment().diff(moment(hiddenbox.endDate)) < 0 ){
            matches = false;
          } 
          break;
        case 'public':
          if( value && moment().diff(moment(hiddenbox.publicDate)) < 0 ){
            matches = false;
          } 
          break;
      }
    });

    return matches;
  });

const applyPagination = (
  hiddenboxes: Hiddenbox[],
  page: number,
  limit: number
): Hiddenbox[] => hiddenboxes
  .slice(page * limit, page * limit + limit);

const descendingComparator = (
  a: Hiddenbox,
  b: Hiddenbox,
  orderBy: string
): number => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order: 'asc' | 'desc', orderBy: string) => (
  order === 'desc'
    ? (a: Hiddenbox, b: Hiddenbox) => descendingComparator(a, b, orderBy)
    : (a: Hiddenbox, b: Hiddenbox) => -descendingComparator(a, b, orderBy)
);

const applySort = (hiddenboxes: Hiddenbox[], sort: Sort): Hiddenbox[] => {
  const [orderBy, order] = sort.split('|') as [string, 'asc' | 'desc'];
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = hiddenboxes.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const HiddenboxListTable: FC<HiddenboxListTableProps> = (props) => {
  const { hiddenboxes, ...other } = props;
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedHiddenboxes, setSelectedHiddenboxes] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [filters, setFilters] = useState<any>({
    beforeSale: null,
    onSale: null,
    afterSale: null,
    public: null
  });

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    const updatedFilters = {
      ...filters,
      beforeSale: null,
      onSale: null,
      afterSale: null,
      public: null
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedHiddenboxes([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value as Sort);
  };

  const handleSelectAllHiddenboxes = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedHiddenboxes(event.target.checked
      ? hiddenboxes.map((hiddenbox) => hiddenbox.id)
      : []);
  };

  const handleSelectOneHiddenbox = (
    event: ChangeEvent<HTMLInputElement>,
    hiddenboxId: number
  ): void => {
    if (!selectedHiddenboxes.includes(hiddenboxId)) {
      setSelectedHiddenboxes((prevSelected) => [...prevSelected, hiddenboxId]);
    } else {
      setSelectedHiddenboxes((prevSelected) => prevSelected.filter((id) => id !== hiddenboxId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  const filteredHiddenboxes = applyFilters(hiddenboxes, query, filters);
  const sortedHiddenboxes = applySort(filteredHiddenboxes, sort);
  const paginatedHiddenboxes = applyPagination(sortedHiddenboxes, page, limit);
  const enableBulkActions = selectedHiddenboxes.length > 0;
  const selectedSomeHiddenboxes = selectedHiddenboxes.length > 0
    && selectedHiddenboxes.length < hiddenboxes.length;
  const selectedAllHiddenboxes = selectedHiddenboxes.length === hiddenboxes.length;

  return (
    <Card {...other}>
      <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="히든박스 검색"
            value={query}
            variant="outlined"
          />
        </Box>
        <Box
          sx={{
            m: 1,
            width: 240
          }}
        >
          <TextField
            label="정렬"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
      </Box>
      {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllHiddenboxes}
              color="primary"
              indeterminate={selectedSomeHiddenboxes}
              onChange={handleSelectAllHiddenboxes}
            />
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              삭제
            </Button>
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
            >
              수정
            </Button>
          </Box>
        </Box>
      )}
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllHiddenboxes}
                    color="primary"
                    indeterminate={selectedSomeHiddenboxes}
                    onChange={handleSelectAllHiddenboxes}
                  />
                </TableCell>
                <TableCell>
                  상품명
                </TableCell>
                <TableCell>
                  판매일
                </TableCell>
                <TableCell>
                  공개일
                </TableCell>
                <TableCell>
                  판매량
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedHiddenboxes.map((hiddenbox) => {
                const isHiddenboxSelected = selectedHiddenboxes.includes(hiddenbox.id);

                return (
                  <TableRow
                    hover
                    key={hiddenbox.id}
                    selected={isHiddenboxSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isHiddenboxSelected}
                        color="primary"
                        onChange={(event) => handleSelectOneHiddenbox(
                          event,
                          hiddenbox.id
                        )}
                        value={isHiddenboxSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/dashboard/hiddenboxes/${hiddenbox.id}`}
                            variant="subtitle2"
                          >
                            {hiddenbox.title}
                          </Link>
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {hiddenbox.author.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {`${moment(hiddenbox.startDate).format("YYYY년 M월 D일 HH:mm")} - ${moment(hiddenbox.endDate).format("YYYY년 M월 D일 HH:mm")}`}
                    </TableCell>
                    <TableCell>
                      {moment(hiddenbox.publicDate).format("YYYY년 M월 D일 HH:mm")}
                    </TableCell>
                    <TableCell>
                      {0}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to="/dashboard/customers/1/edit"
                      >
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={`/dashboard/hiddenboxes/${hiddenbox.id}`}
                      >
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredHiddenboxes.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

HiddenboxListTable.propTypes = {
  hiddenboxes: PropTypes.array.isRequired
};

export default HiddenboxListTable;
