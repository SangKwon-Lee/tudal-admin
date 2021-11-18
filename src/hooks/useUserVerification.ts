import { useEffect, useRef } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { isNull, isUndefined } from 'lodash';

export type IUserType = 'user' | 'hiddenReporter' | 'master';

/**
 * @abstract 해당 페이지에 접근할 수 있는지 판단 (해당 글의 아이디와 유저 아이디를 비교)
 * @param id (string | number): 세가지 타입의 유저 아이디 (계정, 히든 리포터, 달인)
 * @param type(user | hiddenReporter | maseter ) : 유저 아이디의 타입 (계정 아이디, 히든 리포터 아이디, 달인 아이디)
 * @returns : 접근할 수 있다면 PASS / 없다면 401 페이지로 리다이렉트
 */
const useUserVerification = (
  id: number | string,
  type: IUserType,
) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVerified = useRef<boolean>(true);

  const _id = typeof id === 'string' ? Number(id) : id;

  useEffect(() => {
    // 초기 렌더시 id 값이 호출한 컴포넌트에서 넘어오지 않는 경우 PASS
    if (isNull(id) || isUndefined(id)) {
      isVerified.current = true;
    } else {
      switch (type) {
        case 'user':
          isVerified.current = user.id === _id;
          break;

        case 'hiddenReporter':
          isVerified.current = user.hidden_reporter.id === _id;
          break;

        case 'master':
          isVerified.current = user.master.id === _id;
          break;
      }
    }

    // 아이디가 같지 않다면 401
    if (!isVerified.current) {
      navigate('/401');
      return;
    }
  }, [id, _id, type, user, navigate]);
};

export default useUserVerification;
