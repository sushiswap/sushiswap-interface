import { route } from 'next/dist/next-server/server/router';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';
import { useRecoilState } from 'recoil';
import { isAuthorized } from '../recoil/atoms';

const PWD = 'silolis';
const LOGIN_PAGE_URL = '/pass';

const usePasswordCheck = () => {
  const [isAllowed, setIsAllowed] = useRecoilState(isAuthorized);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isAllowed) {
      router.push(LOGIN_PAGE_URL);
    }
  }, [isAllowed]);

  const checkPwd = (pwd: string) => {
    if (pwd === PWD) {
      setIsAllowed(true);
      router.push('/'); //could push from history
    }
  };

  return { checkPwd };
};

export default usePasswordCheck;
