import {useEffect, useRef} from 'react';
import useSetState from 'react-use/lib/useSetState';
import useClosure from '@/hooks/useClosure';
import useCb from '@/hooks/useCb';

const VERTICAL = 'vertical';
const DOWN = 'down';
const UP = 'up';
const HORIZONTAL = 'horizontal';
const TOUCH_MOVE = 'touchmove';
const TOUCH_START = 'touchstart';
const TOUCH_END = 'touchend';
const SCROLL = 'scroll';
const TRANSITION_END = 'transitionend';
const ADD = 'addEventListener';
const REMOVE = 'removeEventListener';
const PASSIVE = {passive: false};

const useRefreshControl = (props) => {
  const {
    damping = Infinity,
    wrapper,
    scroller,
    // indicator,
    onRefresh,
    onPullLoad,
    refreshSwitch,
    pullLoadSwitch,
    distanceThreshold,
    threshold,
    pullLoadThreshold,
    dpl,
  } = props;

  const gesture = useRef({
    offset: 0,
    refreshStep: 0,
    pullLoadStep: 0,
  });

  const [state, setState] = useSetState({
    refreshStep: 0,
    pullLoadStep: 0,
  });

  // 获取保存的数据
  const getGesture = useCb(
    () => {
      return gesture.current;
    },
  );

  // 更新保存的数据
  const updateGesture = useCb(
    (params) => {
      gesture.current = {
        ...gesture.current,
        ...params,
      }
    },
  );

  // 设置下拉刷新状态
  const setRefreshStep = useCb(
    (step) => {
      updateGesture({refreshStep: step});
      setState({
        refreshStep: step,
      });
    },
  );

  // 设置上拉加载的状态
  const setPullLoadStep = useCb(
    (step) => {
      updateGesture({pullLoadStep: step});
      setState({
        pullLoadStep: step,
      });
    },
  );

  const setOffset = useCb(
    /**
     * 设置 拉动位置
     * @param currentOffset {Number} 当前位置
     * @param useTransition {Boolean?} 是否使用 transition 动画 在回弹动画的时候为true
     */
    (currentOffset, useTransition) => {
      const {offset} = getGesture();

      // 要设置的目标值和当前值一致 不在设置
      if (offset === currentOffset) {
        return;
      }
      // 保存当前位置
      updateGesture({offset: currentOffset});
      const scrollerDom = scroller.current;
      const {scrollerStyle} = getGesture();
      let cssText = `transform: translate3d(0, ${currentOffset}px, 1px);`;
      if (useTransition) {
        // 打开 transition 开关 在过渡未结束前 不在监听滑动事件
        updateGesture({isTransition: true});
        cssText += 'transition: transform 300ms linear;';
      }
      scrollerDom.style.cssText = `${cssText}${scrollerStyle}`;
    }
  );

  const getDirection = useCb(
    /**
     * 获取 滑动方向 并锁定
     * @param pageX {Number} touches 对象中的 pageX
     * @param pageY {Number} touches 对象中的 pageY
     * @returns {*}
     */
    (pageX, pageY) => {
      const {
        directionLock,
        startX,
        startY,
      } = gesture.current;
      // 方向已锁定 返回锁定的方向
      if (directionLock) {
        return directionLock;
      }

      // 计算滑动距离 取绝对值
      const absDistX = Math.abs(pageX - startX);
      const absDistY = Math.abs(pageY - startY);

      // 判断滑动方向 采用滑动距离大的方向 并且滑动的距离应该超过设定的阈值
      // 是否是横向滑动
      if (absDistX > absDistY && absDistX >= distanceThreshold * dpl) {
        gesture.current.directionLock = HORIZONTAL;
        return HORIZONTAL;
      }

      // 是否是垂直滑动
      if (absDistY > absDistX && absDistY >= distanceThreshold * dpl) {
        gesture.current.directionLock = VERTICAL;
        return VERTICAL;
      }
    },
  );

  // 判断当前滚动条是否在顶部
  const getStart = useCb(
    () => {
      const target = wrapper.current;

      // 获取滚动条位置
      const {scrollTop} = target;
      // 滚动条必须在顶部
      return Math.round(scrollTop) === 0;
    },
  );

  const onTouchStart = useClosure(
    (e) => {
      const {isTransition, pullLoadStep} = getGesture();

      // 如果下拉刷新开关未打开
      // 或者正在执行 pullLoad 操作，
      // 或者未传入滚动容器
      // 或者未传入刷新函数
      // 或者正在使用 transition 过渡
      // 中断执行
      if (!refreshSwitch
        || pullLoadStep !== 0
        || !scroller
        || !scroller.current
        || !onRefresh
        || isTransition
      ) {
        return;
      }

      // 获取手指滑动位置
      const {pageX, pageY} = e.touches[0];
      // 保存状态
      updateGesture({
        directionLock: null,
        // 是否在顶部
        isStart: getStart(),
        startX: pageX,
        startY: pageY,
        pointX: pageX,
        pointY: pageY,
        isTransition: false,
        direction: null,
      })
    },
  );

  const onTouchMove = useClosure(
    (e) => {
      // 获取手指位置
      const {pageX, pageY} = e.touches[0];

      const {
        pointY,
        isStart,
        refreshStep,
      } = getGesture();
      // 保存当前手指位置
      updateGesture({pointY: pageY});

      // 因为对 body 绑定了 touchmove 事件阻止了默认事件
      // 所有我们需要对正常的滚动阻止事件冒泡，以免影响到正常滚动
      // 滚动条不在最顶部 阻止事件冒泡
      if (!isStart) {
        e.stopPropagation();
        return;
      }

      // 计算滑动距离
      const distY = pageY - pointY;
      const direction = distY > 0 ? DOWN : UP;

      // 当前不在下拉刷新操作中，并且滑动方向为向上也要阻止冒泡
      // 当滚动条在最顶部，并且是向上滑的时候会执行到这里
      if (direction === UP && refreshStep === 0) {
        e.stopPropagation();
      }

      // 获取滑动方向并锁定
      const dirLock = getDirection(pageX, pageY);

      // 如果此次滑动不是垂直方向 直接返回
      if (dirLock !== VERTICAL) {
        return;
      }

      // 保存滚动方向和手指位置
      updateGesture({direction, pointY: pageY});

      // 获取上次拉动位置
      let {offset} = getGesture();
      // 拉动距离递增
      offset += distY;

      // 在下拉的阈值内阻止默认事件
      if (offset >= 0 && offset <= damping) {
        e.preventDefault();
      }

      // 限定拉动范围
      offset = Math.max(0, offset);
      offset = Math.min(damping, offset);
      // 更新状态 和dom
      setOffset(offset);

      // 如果当前下拉处于初始状态 并且本次拉动方向 为 DOWN，需要将 step 设置为 1， 显示拉动提醒
      // 如果当前处于释放刷新状态 并且本次拉动方向 为 UP，并且拉动位置小于释放刷新的阈值 需要将step设置为 1， 还原到 下拉刷新状态
      if ((refreshStep === 0
        && direction === DOWN)
        || (refreshStep === 2
          && direction === UP
          && offset < threshold.load * dpl)) {
        return setRefreshStep(1);
      }

      // 如果当前处于下拉刷新状态 并且拉动位置 大于释放刷新的阈值 将step设置为 2， 显示释放刷新
      if (refreshStep === 1 && offset >= threshold.load * dpl) {
        return setRefreshStep(2);
      }
    },
  );

  const onTouchEnd = useClosure(
    () => {
      const {
        isStart,
        directionLock,
        refreshStep,
        isRefreshFinish,
      } = getGesture();
      // 如果滚动条不在最顶部
      // 滑动方向不是锁定在 垂直方向
      // 下拉为初始状态
      // 中断执行
      if (!isStart || directionLock !== VERTICAL || refreshStep === 0) {
        return;
      }

      // 刷新中停止点
      const stop = threshold.stop * dpl;
      updateGesture({isStart: false});

      // 如果当前处于 释放刷新状态 手指离开屏幕后 应该回弹到刷新中的停止点
      // 并且回弹到位之后 应该更改状态为 刷新中
      if (refreshStep === 2) {
        return setOffset(stop, true);
      }

      // 手指离开屏幕时如果是刷新中状态
      // 并且 刷新函数执行完毕 应该回弹到初始位置 否则回弹到 刷新中的停止点
      if (refreshStep === 3) {
        if (isRefreshFinish) {
          return setOffset(0, true);
        }
        return setOffset(stop, true);
      }

      // 其余情况都应该回到原点
      setOffset(0, true);
    },
  );

  // 执行加载更多
  const doPullLoad = useClosure(
    async () => {

      const {
        refreshStep,
      } = getGesture();

      if (refreshStep !== 0) {
        return;
      }

      // 更新状态
      setPullLoadStep(1);
      try {
        // 执行函数
        await onPullLoad();
      } catch (e) {
        if (__DEV__) {
          console.error(e) // eslint-disable-line
        }
      } finally {
        // 恢复状态
        setPullLoadStep(0);
      }
    },
  );

  const onScroll = useClosure(
    (e) => {
      // 判断滚动条是否在顶部 并保存
      updateGesture({isStart: getStart()});

      const {
        refreshStep,
        pullLoadStep,
        prevScrollTop,
      } = getGesture();

      const {currentTarget} = e;
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = currentTarget;

      // 保存滚动条位置
      updateGesture({prevScrollTop: scrollTop});

      // 当前如果处于下拉刷新状态
      // 或者处于上拉加载状态
      // 或者手动关闭了 上拉加载
      // 或者本次滚动的方向不是向下
      // 或者滚动未达到阈值
      // 或者未传入 pullload 函数
      // 都应该直接中断执行
      if (refreshStep !== 0
        || pullLoadStep !== 0
        || !pullLoadSwitch
        || prevScrollTop > scrollTop
        || Math.ceil(scrollTop + clientHeight + pullLoadThreshold) < scrollHeight
        || !onPullLoad) {
        return;
      }

      doPullLoad();
    },
  );

  const onTransitionEnd = useClosure(
    async () => {
      const {
        refreshStep,
        isTransition,
        isRefreshFinish,
        isStart,
      } = getGesture();
      // 如果不是设置过 transition 样式 直接中断执行
      if (!isTransition) {
        return;
      }
      const {offset} = gesture.current;
      // 关闭 transition 开关
      updateGesture({isTransition: false});

      // 如果当前是刷新中 并且刷新没有结束 直接中断
      // 在 onTouchEnd 监听器中 已经进行了 回弹动画
      if (refreshStep === 3 && !isRefreshFinish) {
        return;
      }

      // 当前是 释放刷新 状态 并且 位置正确
      // 开始加载数据
      if (refreshStep === 2 && offset === threshold.stop * dpl) {
        setRefreshStep(3);
        // 关闭加载成功开关
        updateGesture({isRefreshFinish: false});
        try {
          // 调用 onRefresh 函数加载数据
          await onRefresh();
        } catch (e) {
          // 错误 在开发环境下打印到控制台
          if (__DEV__) {
            console.error(e); // eslint-disable-line
          }
        } finally {
          // 开启刷新完成开关
          updateGesture({isRefreshFinish: true});

          // 当前手指在屏幕上 触发了 touch事件直接中断 交给 onTouchEnd 管理
          if (isStart) {
            return;
          }
          // 回弹到 起始位置
          setOffset(0, true);
        }
        return;
      }

      // 重置 下拉刷新状态
      setRefreshStep(0);
    },
  );

  const bindTransitionEvents = useCb(
    /**
     * 绑定 transitionend 事件
     * @param dom {HTMLElement} 事件目标
     * @param handleKey {String} 'removeEventListener' || 'addEventListener'
     */
    (dom, handleKey) => {
      dom[handleKey](TRANSITION_END, onTransitionEnd);
    },
  );

  const bindEvents = useCb(
    /**
     * 绑定 touch 和 scroll 事件
     * @param dom {HTMLElement} 事件目标
     * @param handleKey {String} 'removeEventListener' || 'addEventListener'
     */
    (dom, handleKey) => {
      dom[handleKey](TOUCH_START, onTouchStart);
      dom[handleKey](TOUCH_MOVE, onTouchMove, PASSIVE);
      dom[handleKey](TOUCH_END, onTouchEnd);
      dom[handleKey](SCROLL, onScroll);
    },
  );

  useEffect(
    () => {
      // 滚动盒子的容器
      const wrapperDom = wrapper && wrapper.current;
      if (!wrapperDom) {
        return;
      }
      // 保存滚动条初始位置
      updateGesture({prevScrollTop: wrapperDom.scrollTop});
      // 滚动盒子
      const scrollerDom = scroller && scroller.current;
      if (scrollerDom) {
        // 保存滚动盒子的初始样式
        updateGesture({scrollerStyle: scrollerDom.style.cssText});
        bindTransitionEvents(scrollerDom, ADD);
      }
      // 绑定事件
      bindEvents(wrapperDom, ADD);

      // 阻止页面默认的滚动
      const preventDefault = (e) => e.preventDefault();
      const {body} = document;
      body[ADD](TOUCH_MOVE, preventDefault, PASSIVE);

      // 事件解绑
      return () => {
        bindEvents(wrapperDom, REMOVE);
        body[REMOVE](TOUCH_MOVE, preventDefault, PASSIVE);
        if (scrollerDom) {
          bindTransitionEvents(scrollerDom, REMOVE);
        }
      };
    },
    [],
  );

  return {
    ...state,
    onClickToPullLoad: doPullLoad,
  };
};

export default useRefreshControl;
