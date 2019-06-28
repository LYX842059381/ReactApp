import {useRef, useEffect, useCallback} from 'react';

// 使用此 hook 包装的函数每次调用获取的状态都是最新的
// 注意此 hook 是异步 无法立即调用
const useClosure = (fn, inputs) => {
  const ref = useRef();

  useEffect(
    () => {
      ref.current = fn;
    },
    inputs,
  );

  return useCallback((...args) => ref.current(...args), []);
};

export default useClosure;
