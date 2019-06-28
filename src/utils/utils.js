import {homeTabs} from '@/config';

const tabs = {};

// 将tabs数组转换为对象
homeTabs.forEach((item) => {
  tabs[item.tab] = item.title.slice(0, 2);
});

export const getCatogory = (tab, top, good) => {
  if (top) {
    return '置顶';
  }
  if (good) {
    return '精华'
  }

  return tabs[tab];
};
