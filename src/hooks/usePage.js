import {useEffect, useRef} from 'react';
import useSetState from 'react-use/lib/useSetState';
import {useLocation} from '@/hooks/router';
import useCheckBack from '@/hooks/useCheckBack';
import {useMappedState, useDispatch} from 'redux-react-hook';
import useCb from '@/hooks/useCb';
import useUpdate from '@/hooks/useUpdate';
import useClosure from '@/hooks/useClosure';

const pageCatch = {};

const usePage = (props) => {
  const {
    // http 请求类型
    requestType = 'get',
    // http 请求体
    requestBody = {},
    action,
    // store 中对应数据的key
    key,
    // 和 key 组合 从 store 中获取数据
    id,
    // 请求参数
    params,
    // 请求路径
    url,
    // 是否带下拉加载
    main = false,
    // 开始页
    startPage = 1,
    // 每翻一页 页码递增的数量
    pageSizeInterval = 1,
    // 存储页面信息的id
    pageId: _pageId = '',
    // 滚动容器
    scroller,
    // 重置页码
    resetPage = false,
    // 是否为单个页面
    isPage = false,
  } = props;
  const dispatch = useDispatch();
  // 检查返回
  const isBack = useCheckBack();

  // 获取路由信息
  const location = useLocation();

  // 生成一个id
  const pageId = `${location.pathname}_${location.search}_${location.hash}_${_pageId}`;

  // 从页面信息缓存中对应数据
  const getPageInfo = useCb(
    () => {
      // 不是一个页面 直接中断
      if (!isPage) {
        return;
      }

      const pageInfo = pageCatch[pageId];

      // 缓存中没有对应信息 新建
      if (!pageInfo) {
        const result = {
          scrollY: 0,
          scrollX: 0,
          page: startPage,
        };
        pageCatch[pageId] = result;
        return result
      }
      return pageInfo;
    },
  );

  // 从页面信息缓存中获取缓存的页码
  const getInitPage = useCb(
    () => {
      // 不是带下拉加载功能的不需要此参数直接中断
      if (!main || !isPage) {
        return;
      }

      // 如果当前路由状态不是返回 直接返回开始页
      if (!isBack) {
        return startPage;
      }
      // 缓存中没有对应信息 返回开始页
      const pageInfo = getPageInfo();

      return pageInfo.page;
    }
  );

  const that = useRef({
    page: getInitPage(),
  });

  const mapState = useCb(
    (state) => {
      const result = state[key];

      // store 单层级
      // const store = {
      //   [key]: {
      //     data: [],
      //     isMounted: true,
      //   }
      // }

      // store 多层级
      // const store = {
      //   [key]: {
      //     data: [],
      //     [id]: {
      //       data: [],
      //       isMounted: true,
      //     }
      //   }
      // };

      if (!id || !result) {
        return result;
      }

      const data = result[id];

      if (!data) {
        return result;
      }

      return data;
    },
    [id, key]
  );

  const stateFromStore = useMappedState(mapState);

  // 数据是否已加载
  const {isMounted} = stateFromStore;

  // 在返回的时候 或者数据未加载的时候 需要打开 loading 提醒
  const [state, setState] = useSetState({
    loading: !isBack || !stateFromStore.isMounted,
  });

  const startFetch = useClosure(
    async () => {
      // 是否是带下拉加载功能
      const finalParams = main ? {...params, page: that.current.page} : params;

      // 是否是post请求
      const args = requestType === 'post' ? [requestBody, url, finalParams] : [finalParams, url];

      // 如果不需要控制弹窗 不再控制弹窗 直接后台加载数据
      if (!that.current.needLoading) {
        try {
          const result = await action(...args);
          dispatch(result);
          if (state.error) {
            setState({error: null});
          }
        } catch (e) {
          throw e;
        }
        return;
      }

      // 如果上次调用发生了错误，清除错误信息
      // 如果 loading 提醒框是关闭的打开
      if (state.error || !state.loading) {
        setState({
          loading: true,
          error: null,
        });
      }

      try {
        const result = await action(...args);
        dispatch(result);
        // 执行成功 关闭 loading 提醒
        setState({
          loading: false,
        });
      } catch (e) {
        if (__DEV__) {
          console.error(e); // eslint-disable-libe
        }
        // 请求错误 也需要关闭提醒 并且设置错误信息
        setState({
          loading: false,
          error: e.message,
        });
      }
    },
  );

  const listenerParams = useClosure(
    () => {
      // 是否需要将页码重置到第一页
      if (resetPage) {
        // 页码初始化
        that.current.page = startPage;
        that.current.needLoading = true;
      }
      return startFetch();
    },
  );

  useEffect(
    () => {
      // 不是返回 或者数据未加载的时候 在首次渲染的时候应该去加载数据
      if (!isBack || !isMounted) {
        that.current.needLoading = true;
        startFetch();
      }

      return () => {
        // 储存页面信息
        // 储存页码
        const pageInfo = {};

        // 下拉模式 需要储存 页码
        if (main) {
          pageInfo.page = that.current.page;
        }

        const dom = scroller && scroller.current;

        // 页面模式 储存 滚动条位置
        if (dom && isPage) {
          pageInfo.scrollY = dom.scrollTop;
          pageInfo.scrollX = dom.scrollLeft;
        }

        pageCatch[pageId] = pageInfo;
      };
    },
    [],
  );

  useUpdate(
    () => {
      listenerParams();
    },
    // 监听 params 的变化
    [JSON.stringify(params)],
  );

  const onRefresh = useClosure(
    () => {
      // 页码初始化
      that.current.page = startPage;
      // 下拉刷新不需要loading提醒框
      that.current.needLoading = false;
      // 加载数据
      return startFetch();
    },
  );

  const onPullLoad = useClosure(
    () => {
      // 页码递增
      that.current.page += pageSizeInterval;
      // 上拉刷新不需要loading提醒框
      that.current.needLoading = false;
      // 加载数据
      return startFetch();
    },
  );

  const result = {
    ...state,
    state: stateFromStore,
  };

  if (isPage) {
    result.pageInfo = getPageInfo();
  }

  // 是带下拉加载功能的返回 onRefresh 和 onPullLoad 函数
  if (main) {
    result.onRefresh = onRefresh;
    result.onPullLoad = onPullLoad;
  }

  return result;
};

export default usePage;
