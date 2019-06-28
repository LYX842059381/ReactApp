import {useContext} from 'react';
import parse from 'qs/lib/parse';
import {__RouterContext} from 'react-router-dom';
import useCb from './useCb';

// 获取全部路由信息
export const useRouter = () => {
  return useContext(__RouterContext);
};

// 获取路由的 history 对象
export const useHistory = () => useRouter().history;

// 获取路由的 location 对象
export const useLocation = () => useRouter().location;

// 获取路由的 match 对象
export const useMatch = () => useRouter().match;

// 将 react-router 的 push 方法 包装成 hooks
export const usePush = (p) => {
  const {push} = useHistory();

  return useCb(
    (path) => {
      push(path || p);
    },
  );
};

// 将 react-router 的 goBack 方法 包装成 hooks
export const useBack = () => {
  const {goBack} = useHistory();

  return useCb(
    () => {
      goBack();
    },
  );
};

// 获取 url 参数
export const useParams = () => useMatch().params;

// 解析查询字符串
export const useSearch = () => {
  const location = useLocation();
  return parse(location.search.slice(1));
};
