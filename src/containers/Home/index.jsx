import React from 'react';
import {Tabs} from 'antd-mobile';
import Flex from '@/components/Flex';
import {
  FILL,
} from '@/utils/constant';
import useCheckBack from '@/hooks/useCheckBack';
import useCb from "@/hooks/useCb";
import {homeTabs, homtTabInitPage} from '@/config';
import TabPanel from './TabPanel';
import './styles/style.module.less';

let prevIndex = homtTabInitPage;

const Home = () => {
  const isBack = useCheckBack();

  // 储存当前展示的 tab 在返回时需要恢复状态
  const onChange = useCb(
    (item, index) => {
      prevIndex = index;
    },
  );

  return (
    <Flex size={FILL}>
      <div styleName="home">
        <Tabs
          onChange={onChange}
          initialPage={isBack ? prevIndex : homtTabInitPage}
          tabs={homeTabs}
          animated={false}
          swipeable={false}
          prerenderingSiblingsNumber={0}
        >
          {
            homeTabs.map(({tab}) => (
              <TabPanel tab={tab} key={tab}/>
            ))
          }
        </Tabs>
      </div>
    </Flex>
  );
};

export default Home;
