import {useContext} from 'react';
import Context from '@/components/CheckBack/Context';
import {useHistory} from '@/hooks/router';

// 通过 路由的 history 对象中 action 属性是否等于 POP 来判断是否是返回
const useCheckBack = () => {
  const {firstLoad} = useContext(Context);
  const {action} = useHistory();

  // 首次加载的时候 history中的action 为 POP 但是不应该是返回状态 所以直接 返回false
  if (firstLoad.current) {
    return false;
  }
  return action === 'POP';
};

export default useCheckBack;
