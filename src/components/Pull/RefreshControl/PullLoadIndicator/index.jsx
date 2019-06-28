import React, {forwardRef, Fragment, useCallback} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd-mobile';
import Flex from '@/components/Flex';
import {CENTER, MIDDLE, WIDTH_FILL} from '@/utils/constant';
import './styles/style.module.less';

const PullLoadIndicator = forwardRef(
  ({step, onClickToPullLoad}, ref) => {
    const renderTip = useCallback(
      () => {
        switch (step) {
          case 1:
            return (
              <Fragment>
                <Icon type="loading"/>
                <span>刷新中</span>
              </Fragment>
            );
          default:
            return (
              <span role="button" onClick={onClickToPullLoad}>
                点击加载更多
              </span>
            );
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

PullLoadIndicator.propTypes = {
  onClickToPullLoad: PropTypes.func,
  step: PropTypes.number.isRequired,
};

export default PullLoadIndicator;
