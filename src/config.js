// 首页tab栏默认展示页面
export const homtTabInitPage = 0;

// 首页tab栏数据
export const homeTabs = [
  {
    title: '全部',
    tab: 'all',
  },
  {
    title: '精华',
    tab: 'good',
  },
  {
    title: '分享',
    tab: 'share',
  },
  {
    title: '问答',
    tab: 'ask',
  },
  {
    title: '招聘',
    tab: 'job',
  },
  {
    title: '测试专用',
    tab: 'dev',
  },
];

// ajax 请求默认配置
export const defaultHttpOptions = {
  baseURL: 'https://cnodejs.org/api/v1/',
  timeout: 30000,
};

// 是否是 app 模式
export const isApp = false;
