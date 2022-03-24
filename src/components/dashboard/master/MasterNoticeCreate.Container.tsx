import { useEffect, useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { APIMaster } from 'src/lib/api';
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
    const [contents, setContents] = useState('');
    const [title, setTitle] = useState('');

    // * WebEditor 변환
    const log = () => {
      if (editorRef.current) {
        return editorRef.current.getContent();
      }
    };

    //* 공지사항 등록
    const handleCreateNotice = async () => {
      const contents = log();
      const newData = {
        title,
        contents,
        master: user.master,
      };

      const editData = {
        title,
        contents,
      };
      try {
        if (mode === 'edit') {
          const { status } = await APIMaster.editMasterNotice(
            noticeId,
            editData,
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
          setTitle(data.title);
          setContents(data.contents);
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
      setTitle('ASD');
      setContents('ASD');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, noticeId]);

    const handleNoticeInputTitle = (e: any) => {
      setTitle(e.target.value);
    };

    const handleNoticeInputContents = (e: any) => {
      setContents(e.target.value);
    };
    useEffect(() => {
      if (user && !user.masters[0]?.id) {
        navigate('/dashboard');
        toast.error('달인을 먼저 생성해주세요');
      }
    }, [user, navigate]);

    return (
      <MasterNoticeCreatePresenter
        editorRef={editorRef}
        mode={mode}
        title={title}
        contents={contents}
        handleNoticeInputTitle={handleNoticeInputTitle}
        handleNoticeInputContents={handleNoticeInputContents}
        handleCreateNotice={handleCreateNotice}
      />
    );
  };

export default MasterNoticeCreateContainer;
