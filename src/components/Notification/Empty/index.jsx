import React from 'react';
import Flex from '@/components/Flex';
import {
  FILL,
  MIDDLE,
  CENTER,
  COLUMN,
} from '@/utils/constant';
import empty from './images/empty.png';
import './styles/style.module.less';

const DefaultEmpty = () => {
  return (
    <Flex
      align={MIDDLE}
      justify={CENTER}
      flex={1}
      styleName="root"
      mode={COLUMN}
      size={FILL}
    >
      <Flex
        styleName="img"
        align={MIDDLE}
        justify={CENTER}
      >
        <img src={empty} alt="empty" width="506" height="310"/>
      </Flex>
      <p styleName="text">
        暂无数据
      </p>
    </Flex>
  );
};

export default DefaultEmpty;
