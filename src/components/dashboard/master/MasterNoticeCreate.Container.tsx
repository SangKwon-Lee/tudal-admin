import { useEffect, useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { APIGroup, APIHR, APIMaster } from 'src/lib/api';
import MasterNoticeCreatePresenter from './MasterNoticeCreate.Presenter';
import toast from 'react-hot-toast';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useNavigate, useParams } from 'react-router';
interface IMasterNoticeCreateProps {
  mode?: string;
}

const MasterNoticeCreateContainer: React.FC<IMasterNoticeCreateProps> =
  (props) => {
    const { user } = useAuth();
    const { noticeId } = useParams();
    const mode = props.mode || 'create';
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [type, setType] = useState('feed');
    const [summary, setSummary] = useState('');
    const [targetId, setTargetId] = useState(0);
    const [masterList, setMasterList] = useState([]);
    const [dailyList, setDailyList] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [feedList, setFeedList] = useState([]);
    const [masterId, setMasterId] = useState(1);

    // * WebEditor 변환
    const log = () => {
      if (editorRef.current) {
        return editorRef.current.getContent();
      }
    };

    //* 마스터 정보 불러오기
    const getMasters = async () => {
      try {
        const { data, status } = await APIMaster.getMasterList();
        if (status === 200 && data.length > 0) {
          setMasterList(data);

          if (mode !== 'edit') {
            setMasterId(data[0].id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    //* 데일리 정보 불러오기
    const getDailyList = async () => {
      try {
        const query = {
          _q: '',
          _start: 0,
          _limit: 30,
          _sort: 'created_at:DESC',
        };
        const { data, status } = await APIGroup.getGroups(query);
        if (status === 200 && data.length > 0) {
          setDailyList(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    //* 피드 정보 불러오기
    const getFeedtList = async () => {
      try {
        const { data, status } = await APIMaster.getFeeds(
          '',
          masterId,
        );
        if (status === 200 && data.length > 0) {
          setFeedList(data);
          if (mode !== 'edit') {
            setTargetId(data[0].id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    //* 히든리포트 정보 불러오기
    const getHiddenReportList = async () => {
      try {
        const { data, status } = await APIHR.getMasterReport(
          masterId,
        );
        if (status === 200 && data.length > 0) {
          setReportList(data);
          if (mode !== 'edit') {
            setTargetId(data[0].id);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    //* 공지사항 등록
    const handleCreateNotice = async () => {
      const contents = log();
      let newData = {};
      if (type === 'feed' || type === 'hiddenreport') {
        newData = {
          title,
          contents,
          targetId,
          type,
          summary,
          master: masterId,
        };
      } else {
        newData = {
          title,
          contents,
          targetId,
          type,
          summary,
          master: null,
        };
      }
      try {
        if (mode === 'edit') {
          const { status } = await APIMaster.editMasterNotice(
            noticeId,
            newData,
          );
          if (status === 200) {
            toast.success('공지가 수정됐습니다.');
          }
        } else {
          const { status } = await APIMaster.postMasterNotice(
            newData,
          );
          if (status === 200) {
            toast.success('공지가 생성됐습니다');
          }
        }
      } catch (e) {
        toast.error('오류가 발생했습니다.');
        console.log(e);
      } finally {
        navigate('/dashboard/master/notice');
      }
    };

    //* 기존 공지사항 데이터 불러오기
    const handleGetNotice = async () => {
      try {
        const { status, data } = await APIMaster.getMasterNotice(
          noticeId,
          user.id,
        );
        if (status === 200) {
          if (data.master) {
            setMasterId(data.master.id);
          }
          setTitle(data.title);
          setContents(data.contents);
          setType(data.type);
          setSummary(data.summary);
          setTargetId(data.targetId);
        }
      } catch (e) {
        console.log(e);
      }
    };

    //* 기존 글 불러오는 useEffect
    useEffect(() => {
      if (mode === 'edit') {
        handleGetNotice();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, noticeId]);

    // * 타이틀
    const handleNoticeInputTitle = (e: any) => {
      setTitle(e.target.value);
    };

    // * 일반 공지사항
    const handleNoticeInputContents = (e: any) => {
      setContents(e.target.value);
    };

    // * 마스터 선택
    const handleMasterId = (e: any) => {
      setMasterId(e.target.value);
    };

    // * 타입 선택
    const handleType = (e: any) => {
      setType(e.target.value);
    };

    // * 타입 선택
    const handleSummary = (e: any) => {
      setSummary(e.target.value);
    };

    // * 타겟 Id 선택
    const handleTarget = (e: any) => {
      setTargetId(e.target.value);
    };

    // * 달인, 데일리 리스트 불러오기
    useEffect(() => {
      getMasters();
      getDailyList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // * 달인, 데일리 리스트 불러오기
    useEffect(() => {
      getHiddenReportList();
      getFeedtList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [masterId]);

    return (
      <MasterNoticeCreatePresenter
        mode={mode}
        type={type}
        title={title}
        targetId={targetId}
        summary={summary}
        contents={contents}
        masterId={masterId}
        dailyList={dailyList}
        editorRef={editorRef}
        feedList={feedList}
        handleType={handleType}
        masterList={masterList}
        reportList={reportList}
        handleTarget={handleTarget}
        handleSummary={handleSummary}
        handleMasterId={handleMasterId}
        handleCreateNotice={handleCreateNotice}
        handleNoticeInputTitle={handleNoticeInputTitle}
        handleNoticeInputContents={handleNoticeInputContents}
      />
    );
  };

export default MasterNoticeCreateContainer;
