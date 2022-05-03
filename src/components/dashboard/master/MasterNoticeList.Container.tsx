import { useCallback, useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { APIMaster } from 'src/lib/api';
import { IMasterNotice } from 'src/types/master';
import MasterNoticeListPresenter from './MasterNoticeList.Presenter';
import toast from 'react-hot-toast';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useNavigate } from 'react-router';

const MasterNoticeListContainer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  //* 공지 리스트
  const [noticeList, setNoticeList] = useState<IMasterNotice[]>([
    {
      title: '',
      contents: '',
      created_at: '',
      id: 0,
      master: {},
    },
  ]);

  // * 리스트 길이
  const [noticeLength, setNoticeLength] = useState(0);
  // * Notice ID 저장
  const [noticeId, setNoticeId] = useState(0);
  // * 로딩
  const [loading, setLoading] = useState(false);
  // * 페이지
  const [page, setPage] = useState(1);
  // * query
  const [query, setQuery] = useState({
    _q: '',
    _start: 0,
    _limit: 20,
    _sort: 'created_at:desc',
  });
  // *모달
  const [modalOpen, setModalOpen] = useState(false);

  // * 리스트 불러오기
  const getMasterNotice = useCallback(async () => {
    setLoading(true);
    try {
      const { data, status } = await APIMaster.getMasterNoticeList(
        query,
      );
      const { data: List } =
        await APIMaster.getMasterMoticeListLength();
      if (status === 200) {
        setNoticeList(data);
        setLoading(false);
        setNoticeLength(List);
      }
    } catch (e) {
      console.log(e);
    }
  }, [query]);

  // * 공지 삭제 함수
  const handleDeleteNotice = async () => {
    try {
      const { status } = await APIMaster.deleteMasterNotice(noticeId);
      if (status === 200) {
        toast.success('공지가 삭제됐습니다.');
        getMasterNotice();
      }
    } catch (e) {
      toast.error('오류가 발생했습니다.');
      console.log(e);
    } finally {
      setModalOpen(false);
    }
  };

  // *리스트 불러오는 useEffect
  useEffect(() => {
    if (user.master) {
      getMasterNotice();
    }
  }, [getMasterNotice, user.master]);

  // * query 변경 함수
  const handleChangeQuery = (e: any) => {
    setQuery({
      ...query,
      _q: e.target.value,
      _start: 0,
    });
    setPage(1);
  };

  console.log(noticeList);
  // *페이지 변경 함수
  const handleChangePage = (page: number) => {
    setPage(page);
    setQuery({
      ...query,
      _start: (page - 1) * 20,
    });
  };

  // * 모달 오픈
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  // * Notice Id 저장 함수
  const handleSaveNoticeId = (noticeId: number) => {
    setNoticeId(noticeId);
  };

  useEffect(() => {
    if (user && !user.masters[0]?.id) {
      navigate('/dashboard');
      toast.error('달인을 먼저 생성해주세요');
    }
  }, [user, navigate]);

  return (
    <MasterNoticeListPresenter
      page={page}
      modalOpen={modalOpen}
      loading={loading}
      noticeList={noticeList}
      noticeLength={noticeLength}
      handleChangeQuery={handleChangeQuery}
      handleChangePage={handleChangePage}
      handleModalOpen={handleModalOpen}
      handleDeleteNotice={handleDeleteNotice}
      handleModalClose={handleModalClose}
      handleSaveNoticeId={handleSaveNoticeId}
    />
  );
};

export default MasterNoticeListContainer;
