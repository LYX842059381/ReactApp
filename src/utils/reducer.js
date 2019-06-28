import curry from 'lodash/curry';
import compose, {ComposeResult} from '@/utils/compose';

// 从 ComposeResult 中提取 state
export const resolveState = state => state;

// 合并reducer
export const reducerCompose = (...args) => compose(resolveState, ...args);

export const arrInitState = {data: []};
export const objInitState = {data: {}};

// 多层级的带 下拉刷新 上拉加载的 reducer生成器
export const multiPullLoadAdapter = curry(
  (actionType, state, action) => {
    const {
      type,
      params,
      payload,
      ...other
    } = action;

    const adapter = (data) => {
      return {
        ...state,
        [params.id]: {
          ...other,
          data,
          isMounted: true,
        }
      }
    };

    switch (type) {
      case actionType:
        switch (params.page) {
          // 第一页直接覆盖数据
          case 1:
            return new ComposeResult(
              adapter(payload),
              action,
            );
          default:
            // 其余的push进列表中
            return new ComposeResult(
              adapter(((state[params.id] && state[params.id].data) || []).concat(payload)),
              action,
            );
        }
      default:
        return new ComposeResult(
          state || arrInitState,
          action,
        );
    }
  },
);

// 多层级的一个 reducer 生成器
export const multiAdapter = curry(
  (initial, actionType, state, action) => {
    const {
      type,
      params,
      payload,
      ...other
    } = action;
    switch (type) {
      case actionType:
        return new ComposeResult(
          {
            ...state,
            [params.id]: {
              ...other,
              data: payload,
              isMounted: true,
            }
          },
          action,
        );
      default:
        return new ComposeResult(
          state || initial,
          action,
        );
    }
  },
);

// 默认值为 数组的 多层级reducer 生成器
export const arrMultiAdapter = multiAdapter(arrInitState);
// 默认值为 对象的 多层级reducer 生成器
export const objMultiAdapter = multiAdapter(objInitState);
