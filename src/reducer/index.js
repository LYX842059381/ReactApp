import {combineReducers} from 'redux';
import {
  reducerCompose,
  arrMultiAdapter,
  objMultiAdapter,
  multiPullLoadAdapter,
} from '@/utils/reducer';
import {ComposeResult} from '@/utils/compose';
import {
  TOPIC_ARTICLE,
  TOPICS,
  USER_INFO,
  COLLECT,
  DE_COLLECT,
  TOPIC_COLLECT,
} from '@/action';

export default combineReducers({
  topics: reducerCompose(
    multiPullLoadAdapter(TOPICS),
  ),
  article: reducerCompose(
    (state, action) => {
      const {params, type} = action;

      const adapter = (flag) => {
        const {id} = params;
        return {
          ...state,
          [id]: {
            ...state[id],
            data: {
              ...state[id].data,
              is_collect: flag,
            },
          },
        }
      };

      switch (type) {
        case COLLECT:
          return new ComposeResult(
            adapter(true),
            action,
          );
        case DE_COLLECT:
          return new ComposeResult(
            adapter(false),
            action,
          );
        default:
          return new ComposeResult(state, action);
      }
    },
    objMultiAdapter(TOPIC_ARTICLE),
  ),
  userInfo: reducerCompose(
    objMultiAdapter(USER_INFO),
  ),
  topicCollect: reducerCompose(
    arrMultiAdapter(TOPIC_COLLECT),
  ),
});
