import { useCallback, useEffect, useState } from 'react';
import { getTagList, getTagListCount } from 'src/lib/api/tag.api';
import { Tags } from 'src/types/tags';
import NewKeywordPresenter from './NewKeyword.Presenter';

const sortOptions = [
  {
    label: '수정일 최신순',
    value: 'updated_at:desc',
  },
  {
    label: '요약문 없는 순',
    value: 'summary:asc',
  },
  {
    label: '설명문 없는 순',
    value: 'description:asc',
  },
  {
    label: '이름순',
    value: 'name:desc',
  },
];

const NewKeywordContainer = () => {
  //* 키워드 목록
  const [keywordList, setKeywordList] = useState<Tags[]>([]);
  //* 키워드 목록 리스트 전체 길이
  const [listLength, setListLength] = useState<any>(0);
  //* 키워드 검색 조건
  const [search, setSearch] = useState({
    _q: '',
    _sort: sortOptions[0].value,
    _start: 0,
    _limit: 30,
    'stocks.name': '',
  });

  //* page
  const [page, setPage] = useState(1);

  //*로딩
  const [loading, setLoading] = useState(false);

  //*drawer open
  const [open, setOpen] = useState(false);

  //* keywordId
  const [keywordId, setKeywordId] = useState(0);

  //*검색 onChange
  const handleSearch = (e: any) => {
    setSearch({
      ...search,
      [e.target.id]: e.target.value,
    });
  };

  //* 페이지 변경
  const handlePage = (e: any) => {
    setSearch({
      ...search,
      _start: e * search._limit,
    });
  };

  //* 키워드 목록 받아오기
  const getKeywordList = useCallback(async () => {
    try {
      setLoading(true);
      const { data, status } = await getTagList(search);
      const { data: length, status: lengthStatus } =
        await getTagListCount(search);
      if (status === 200 && lengthStatus === 200) {
        setListLength(length);
        setKeywordList(data);
        setPage(1);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    getKeywordList();
  }, [getKeywordList, search]);

  return (
    <NewKeywordPresenter
      page={page}
      open={open}
      setOpen={setOpen}
      search={search}
      loading={loading}
      listLength={listLength}
      handlePage={handlePage}
      keywordList={keywordList}
      handleSearch={handleSearch}
      sortOptions={sortOptions}
      keywordId={keywordId}
      setKeywordId={setKeywordId}
    ></NewKeywordPresenter>
  );
};

export default NewKeywordContainer;
