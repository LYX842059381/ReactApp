import React from 'react';
import PropTypes from 'prop-types';
import Flex from '@/components/Flex';
import {MIDDLE, WIDTH_FILL} from '@/utils/constant';
import './styles/style.module.less';

const Header = ({count}) => {
  return (
    <Flex align={MIDDLE} size={WIDTH_FILL} styleName="header">
      <span>
        {`${count} 回复`}
      </span>
    </Flex>
  );
};

Header.propTypes = {
  count: PropTypes.number.isRequired,
};

export default Header
