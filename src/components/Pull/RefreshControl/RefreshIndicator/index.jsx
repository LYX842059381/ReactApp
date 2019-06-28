import React, {forwardRef, Fragment, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd-mobile';
import Flex from '@/components/Flex';
import CustomIcon from '@/components/Icon';
import {CENTER, MIDDLE, WIDTH_FILL} from '@/utils/constant';
import './styles/style.module.less';

const RefreshIndicator = forwardRef(
  ({step}, ref) => {
    const renderTip = useCallback(
      () => {
        switch (step) {
          case 1:
            return (
              <Fragment>
                <CustomIcon type="arrowsdown"/>
                <span>下拉刷新数据</span>
              </Fragment>
            );
          case 2:
            return (
              <Fragment>
                <CustomIcon styleName="rotate" type="arrowsdown"/>
                <span>释放刷新数据</span>
              </Fragment>
            );
          case 3:
            return (
              <Fragment>
                <Icon type="loading"/>
                <span>刷新中</span>
              </Fragment>
            );
          default:
            return null;
        }
      },
      [step],
    );

    return (
      <Flex
        size={WIDTH_FILL}
        align={MIDDLE}
        justify={CENTER}
        styleName="indicator"
        ref={ref}
      >
        {renderTip()}
      </Flex>
    );
  },
);

RefreshIndicator.propTypes = {
  step: PropTypes.number.isRequired,
};

export default RefreshIndicator;
