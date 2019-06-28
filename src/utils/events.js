import curry from 'lodash/curry';

// 事件代理
export default class Events {
  eventCommissionHandle = curry(
    (handle, selector, event) => {
      const {currentTarget, target} = event;
      let eventTarget = target;
      // 当 eventTarget 等于 currentTarget 的时候 说明触发事件的不是目标元素
      // 中断循环
      while (eventTarget && eventTarget !== currentTarget) {
        // 当前元素是否是目标元素
        if (eventTarget.matches(selector)) {
          // 是的话 调用监听函数
          // 中断循环
          return handle(event, eventTarget);
        }
        // 不是的话
        // 往上继续匹配
        eventTarget = eventTarget.parentNode;
      }
    },
  );

  on(target, selector, event, handle) {
    // 包装事件监听函数
    this.handle = this.eventCommissionHandle(handle, selector);
    // 监听事件
    target.addEventListener(event, this.handle);
  }

  off(target, selector, event) {
    // 移除事件
    target.removeEventListener(event, this.handle);
    this.handle = null;
  }
}
