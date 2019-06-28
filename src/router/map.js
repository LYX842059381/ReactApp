import Home from '@/containers/Home';
import Topic from '@/containers/Topic';
import User from '@/containers/User';
import TopicCollect from '@/containers/TopicCollect';
import NavBar from '@/components/NavBar';

export default [
  {
    path: '/',
    component: NavBar,
    exact: false,
    routes: [
      // 首页
      {
        path: '/',
        component: Home,
      },
      // 文章页
      {
        path: '/topic/:id',
        component: Topic,
      },
      // 用户信息
      {
        path: '/user/:id',
        component: User,
      },
      // 用户收藏
      {
        path: '/collect/:id',
        component: TopicCollect,
      },
    ],
  },
];
