import {useEffect} from 'react';
import {usePush} from '@/hooks/router';
import useCb from '@/hooks/useCb';
import Events from '@/utils/events';

const useEvents = (wrapper) => {
  const push = usePush();

  const onClick = useCb(
    (e, target) => {
      // 获取 将要跳转的路径
      const href = target.getAttribute('href');
      // 如果是相对路径则是站内路径 阻止默认事件 调用路由的 push 方法
      if (href.indexOf('/') === 0) {
        e.preventDefault();
        push(href)
      }

      // 如果是路径为 此站点（https://cnodejs.org）路径 也为站内路径
      if (href.indexOf('https://cnodejs.org') === 0) {
        e.preventDefault();
        push(href.replace(/https:(www.)?\/\/cnodejs.org/g, ''))
      }
    }
  );

  useEffect(
    () => {
      const dom = wrapper.current;
      if (!dom) {
        return;
      }

      // 实例化 事件委托对象
      const events = new Events();

      // 绑定事件
      events.on(dom, 'a', 'click', onClick);

      return () => {
        // 解绑事件
        events.off(dom, 'a', 'click', onClick);
      }
    },
    [],
  );
};

export default useEvents;
