import {useRef, useEffect} from 'react';

// 自定义 react update阶段 钩子 hooks
// 通过 useEffect 来实现
// useEffect 第二个参数传 [] 时为 mount 阶段执行
// 不传时 每次都会执行 包括 mount 阶段
// 也可以监听某一个 props 或者 state 的更新
// 所有 只需要 排除 mount 阶段的执行就可以简单实现 update 阶段的钩子，并且可以针对某项数据进行监听
const useUpdate = (fn, inputs) => {
  // 通过 useRef hook定义一个首次加载的变量 在整个组件的生命周期内会一直存在
  const firstLoad = useRef(true);

  useEffect(
    () => {
      // 首次加载直接中断 并关闭开关 不在拦截 update 阶段的执行
      if (firstLoad.current) {
        firstLoad.current = false;
        return;
      }
      fn();
    },
    inputs,
  );
};

export default useUpdate;
