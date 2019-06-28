import React from 'react';
import Flex from '@/components/Flex';
import {MIDDLE} from '@/utils/constant';
import './styles/style.module.less';

const ListHeader = ({text}) => {
  return (
    <Flex align={MIDDLE} styleName="header">
      {text}
    </Flex>
  );
};

export default ListHeader;
