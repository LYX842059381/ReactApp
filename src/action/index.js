import compose from '@/utils/compose';
import {actionCreater} from '@/utils/action';
import {
  checkRequestSuccess,
  http,
  packGetParams,
  packGetMethod,
  packDefaultParams,
  pageListParams,
  packPostParams,
  packPostMethod,
  packRequestIdFromParams,
  packRequestIdFromData,
  packAccessToken,
} from '@/utils/http';

export const TOPIC_ARTICLE = 'TOPIC_ARTICLE';
export const TOPICS = 'TOPICS';
export const USER_INFO = 'USER_INFO';
export const COLLECT = 'COLLECT';
export const DE_COLLECT = 'DE_COLLECT';
export const TOPIC_COLLECT = 'TOPIC_COLLECT';

// 获取文章
// https://cnodejs.org/api/v1/topic/5433d5e4e737cbe96dcef312
export const getArticle = compose(
  actionCreater(TOPIC_ARTICLE),
  checkRequestSuccess,
  http,
  packGetMethod,
  packGetParams('topic/'),
  packAccessToken,
  packDefaultParams,
);

// 获取列表
// https://cnodejs.org/api/v1/topics
export const getTopics = compose(
  actionCreater(TOPICS),
  checkRequestSuccess,
  http,
  packGetMethod,
  packRequestIdFromParams('tab'),
  packGetParams('topics'),
  pageListParams,
  packDefaultParams,
);

// 获取用户信息
// https://cnodejs.org/api/v1/user/alsotang
export const getUserInfo = compose(
  actionCreater(USER_INFO),
  checkRequestSuccess,
  http,
  packGetMethod,
  packGetParams('user/'),
  packAccessToken,
  packDefaultParams,
);

// 收藏
// https://cnodejs.org/api/v1/topic_collect/collect
export const setCollect = compose(
  actionCreater(COLLECT),
  checkRequestSuccess,
  http,
  packPostMethod,
  packRequestIdFromData('topic_id'),
  packPostParams('topic_collect/collect'),
  packAccessToken,
);

// 取消收藏
// https://cnodejs.org/api/v1/topic_collect/de_collect
export const setDelCollect = compose(
  actionCreater(DE_COLLECT),
  checkRequestSuccess,
  http,
  packPostMethod,
  packRequestIdFromData('topic_id'),
  packPostParams('topic_collect/de_collect'),
  packAccessToken,
);

// 用户收藏的主题
// https://cnodejs.org/api/v1/topic_collect/alsotang
export const getTopicCollect = compose(
  actionCreater(TOPIC_COLLECT),
  checkRequestSuccess,
  http,
  packGetMethod,
  packGetParams('topic_collect/'),
  packAccessToken,
  packDefaultParams,
);
