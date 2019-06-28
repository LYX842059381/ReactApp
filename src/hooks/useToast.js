import curry from 'lodash/curry';
import {useCallback, useRef} from 'react';
import useUnmount from 'react-use/lib/useUnmount';
import {Toast} from 'antd-mobile';

/**
 * 对 antd-mobile 的 Toast 组件的封装
 * 支持延时调用
 * @returns {{fail: *, hide: *, success: *, loading: *, info: *}}
 */
const useToast = () => {
  const that = useRef({});

  const clear = useCallback(
    () => {
      // 清除定时器
      that.current.timer && clearTimeout(that.current.timer);
      that.current.timer = null;
    },
    [],
  );

  const show = useCallback(
    curry((key, content, time, delay = 0, onClose = null) => {
      // 关闭后的回调
      const closeCallback = () => {
        onClose && onClose();
        // 将开关关闭 此开关 是为了避免多次打开和关闭时的错误
        that.current.isShow = false;
      };

      const fn = () => {
        // 清除定时器
        clear();
        // 打开开关
        that.current.isShow = true;
        // 显示提示框
        return Toast[key](content, time, closeCallback, false);
      };

      // 不需要延时的直接执行
      if (!delay) {
        return fn();
      }

      // 延时执行
      that.current.timer = setTimeout(
        () => fn(),
        delay * 1000,
      );
    }),
    [],
  );

  // 关闭提醒框
  const hide = useCallback(
    () => {
      // 如果是关闭状态直接中断
      if (!that.current.isShow) {
        return;
      }
      // 否则关闭提醒框
      that.current.isShow = false;
      Toast.hide();
    },
    [],
  );

  useUnmount(() => {
    // 组件卸载的时候 清除定时器 关闭提醒框
    clear();
    hide();
  });

  return {
    success: show('success'),
    loading: show('loading'),
    fail: show('fail'),
    info: show('info'),
    hide,
  };
};

export default useToast;
