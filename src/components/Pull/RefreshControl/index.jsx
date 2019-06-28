import React, {forwardRef, useRef} from 'react';
import PropTypes from 'prop-types';
import Show from '@/components/Show';
import useRefreshControl from '@/hooks/useRefreshControl';
import PullWrapper from '../Wrapper';
import PullLoadIndicator from './PullLoadIndicator';
import RefreshIndicator from './RefreshIndicator';
import './styles/style.module.less';

const RefreshControl = forwardRef(
  (props, ref) => {
    const wrapper = useRef();
    const scroller = useRef();
    const wrapperRef = ref || wrapper;

    const {
      className,
      children,
      onRefresh,
      onPullLoad,
      refreshSwitch,
      pullLoadSwitch,
      pageInfo,
      ...other
    } = props;

    const {
      refreshStep,
      pullLoadStep,
      onClickToPullLoad,
    } = useRefreshControl({
      ...other,
      onRefresh,
      onPullLoad,
      refreshSwitch,
      pullLoadSwitch,
      wrapper: wrapperRef,
      scroller,
    });

    return (
      <PullWrapper
        className={className}
        pageInfo={pageInfo}
        ref={wrapperRef}
      >
        <div styleName="scroller" ref={scroller}>
          <Show show={!!refreshSwitch && !!onRefresh}>
            <RefreshIndicator step={refreshStep} />
          </Show>
          {children}
          <Show show={!!pullLoadSwitch && !!onPullLoad}>
            <PullLoadIndicator step={pullLoadStep} onClickToPullLoad={onClickToPullLoad} />
          </Show>
        </div>
      </PullWrapper>
    );
  }
);

RefreshControl.propTypes = {
  dpl: PropTypes.number,
  onRefresh: PropTypes.func,
  onPullLoad: PropTypes.func,
  refreshSwitch: PropTypes.bool,
  pullLoadSwitch: PropTypes.bool,
  distanceThreshold: PropTypes.number,
  threshold: PropTypes.object,
  children: PropTypes.any,
  className: PropTypes.string,
  pullLoadThreshold: PropTypes.number,
};

RefreshControl.defaultProps = {
  dpl: window.devicePixelRatioValue,
  distanceThreshold: 15,
  pullLoadSwitch: true,
  refreshSwitch: true,
  threshold: {
    stop: 30,
    load: 80,
  },
  pullLoadThreshold: 120,
};

export default RefreshControl;
