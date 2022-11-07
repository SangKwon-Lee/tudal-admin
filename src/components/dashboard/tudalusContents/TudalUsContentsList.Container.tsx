import { useCallback, useEffect, useState } from 'react';
import { APITudalusContents } from 'src/lib/api';
import TudalUsContentsListPresenter from './TudalUsContentsList.Presenter';

export interface contentsList {
  id: number;
  title: string;
  contents: string;
  isMain: boolean;
  created_at: string;
  thumbnail: string;
}
const TudalUsContentsListContainer = () => {
  const [contentsList, setContentsList] = useState<contentsList[]>(
    [],
  );
  const [query, setQuery] = useState({
    _q: '',
    _start: 0,
    _limit: 30,
    _sort: 'created_at:desc',
  });

  // *페이지네이션
  const [page, setPage] = useState(1);
  const [listCount, setListCount] = useState(0);

  // * 리스트 받아오기
  const getTudalUsContentsList = useCallback(async () => {
    try {
      const { data, status } =
        await APITudalusContents.getTudalusContentsList(query);
      const { data: count, status: countStatus } =
        await APITudalusContents.getTudalusContentsListCount(query);
      if (status === 200) {
        setContentsList(data);
      }
      if (countStatus === 200) {
        setListCount(count);
      }
    } catch (e) {
      console.log(e);
    }
  }, [query]);

  // * 메인 올리기 내리기
  const updateTudalUsContentsIsMain = async (
    id: string | number,
    isMain: boolean,
  ) => {
    try {
      const { status } = await APITudalusContents.editTudalusContents(
        id,
        {
          isMain: !isMain,
        },
      );
      if (status === 200) {
        alert('정상 처리 되었습니다.');
        getTudalUsContentsList();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // * 게시글 삭제
  const deleteTudalUsContents = async (id: string | number) => {
    try {
      const { status } =
        await APITudalusContents.deleteTudalusContents(id);
      if (status === 200) {
        alert('게시글이 삭제됐습니다.');
        getTudalUsContentsList();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // *페이지 수정
  const handleChangePage = (event) => {
    setPage(event);
    setQuery({
      ...query,
      _start: (event - 1) * 30,
    });
  };

  // * 검색어 입력
  const handleChangeQuery = (event) => {
    setQuery({
      ...query,
      _q: event.target.value,
    });
  };

  useEffect(() => {
    getTudalUsContentsList();
  }, [getTudalUsContentsList]);

  return (
    <TudalUsContentsListPresenter
      page={page}
      query={query}
      listCount={listCount}
      contentsList={contentsList}
      handleChangePage={handleChangePage}
      handleChangeQuery={handleChangeQuery}
      deleteTudalUsContents={deleteTudalUsContents}
      updateTudalUsContentsIsMain={updateTudalUsContentsIsMain}
    />
  );
};

export default TudalUsContentsListContainer;
