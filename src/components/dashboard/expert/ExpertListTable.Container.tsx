import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { cmsServer } from '../../../lib/axios';
import {
  applyFilters,
  applyPagination,
  applySort,
} from '../../../utils/sort';
import { APIExpert } from 'src/lib/api';
import ExpertListTablePresenter from './ExpertListTable.Presenter';
import useMounted from 'src/hooks/useMounted';

// 감싼 컴포넌트에 React.forwardRef를 사용해 ref를 제공해주면 된다.
// const Bar = forwardRef((props: any, ref: any) => (
//   <div {...props} ref={ref}>
//     {props.children}
//   </div>
// ));

// 정렬 로직
type Sort =
  | 'updated_at|desc'
  | 'updated_at|asc'
  | 'likes|desc'
  | 'likes|asc'
  | 'viewCount|desc'
  | 'viewCount|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    label: '최신순',
    value: 'updated_at|desc',
  },
  {
    label: '오래된순',
    value: 'updated_at|asc',
  },
  {
    label: '좋아요 높은순',
    value: 'likes|desc',
  },
  {
    label: '좋아요 낮은순',
    value: 'likes|asc',
  },
  {
    label: '조회수 높은순',
    value: 'viewCount|desc',
  },
  {
    label: '조회수 낮은순',
    value: 'viewCount|asc',
  },
];

const ExpertListTableContainer = () => {
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedExperts, setSelectedExperts] = useState<number[]>(
    [],
  );
  const mounted = useMounted();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>(sortOptions[0].value);
  const [open, setOpen] = useState<boolean>(false);
  const [experts, setExperts] = useState([]);

  const getExperts = useCallback(
    async (reload = false) => {
      try {
        const response = await APIExpert.getList();
        console.log(response.data);
        if (mounted || reload) {
          setExperts(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [mounted],
  );

  useEffect(() => {
    getExperts();
  }, [getExperts]);

  //* 탭 변경
  const handleTabsChange = (
    __: ChangeEvent<{}>,
    value: string,
  ): void => {
    const updatedFilters = {
      beforeSale: null,
      onSale: null,
      afterSale: null,
      public: null,
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }
    setSelectedExperts([]);
    setCurrentTab(value);
  };

  //* 삭제 모달
  const onClickDelete = () => {
    setOpen(true);
  };

  const reload = () => {
    getExperts();
  };
  const handleDelete = async () => {
    try {
      const expertId = selectedExperts[0];
      console.log(expertId);
      const response = await cmsServer.put(
        `/expert-feeds/${expertId.toString()}`,
        {
          isDeleted: true,
        },
      );
      if (response.status === 200) {
        reload();
      }
    } catch (e) {
    } finally {
      setOpen(false);
    }
  };

  //* 검색어
  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setQuery(event.target.value);
  };

  //* 정렬 변경
  const handleSortChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSort(event.target.value as Sort);
  };

  //* 페이지 변경
  const handlePageChange = (__: any, newPage: number): void => {
    setPage(newPage);
  };

  //* 리스트 수 변경
  const handleLimitChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setLimit(parseInt(event.target.value, 10));
  };

  //* 리스트에서 게시글 선택
  const handleSelectOneExpert = (
    __: ChangeEvent<HTMLInputElement>,
    expertId: number,
  ): void => {
    if (!selectedExperts.includes(expertId)) {
      setSelectedExperts((prevSelected) => [expertId]);
    } else {
      setSelectedExperts((prevSelected) =>
        prevSelected.filter((id) => id !== expertId),
      );
    }
  };

  //* 최종 리스트, 정렬 데이터
  const filteredExperts = applyFilters(experts, query);
  const sortedExperts = applySort(filteredExperts, sort);
  const paginatedExperts = applyPagination(
    sortedExperts,
    page,
    limit,
  );
  const enableBulkActions = selectedExperts.length > 0;

  return (
    <ExpertListTablePresenter
      experts={experts}
      handleTabsChange={handleTabsChange}
      currentTab={currentTab}
      handleQueryChange={handleQueryChange}
      query={query}
      handleSortChange={handleSortChange}
      sort={sort}
      enableBulkActions={enableBulkActions}
      onClickDelete={onClickDelete}
      paginatedExperts={paginatedExperts}
      selectedExperts={selectedExperts}
      handleSelectOneExpert={handleSelectOneExpert}
      handlePageChange={handlePageChange}
      handleLimitChange={handleLimitChange}
      page={page}
      limit={limit}
      open={open}
      setOpen={setOpen}
      handleDelete={handleDelete}
      reload={reload}
    />
  );
};

export default ExpertListTableContainer;
