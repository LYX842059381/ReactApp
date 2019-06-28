import React, {memo, useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Icon} from 'antd-mobile';
import Show from '@/components/Show';
import Flex from '@/components/Flex';
import useCb from '@/hooks/useCb';
import useUpdate from '@/hooks/useUpdate';
import useClosure from '@/hooks/useClosure';
import {COLUMN, MIDDLE} from '@/utils/constant';
import equal from '@/utils/equal';
import './styles/style.module.less';

const Common = memo(
  (props) => {
    const {
      children,
      text,
      className,
      show,
      toast,
      fill,
      iconProps,
      closeable,
      onClose,
    } = props;

    const [visible, set] = useState(!!show);

    const listenerShow = useClosure(
      () => {
        // 监听错误 判断是否显示错误提醒
        // 如果将要变更的目标状态和当前状态一样 不进行变更
        const currentShow = !!show;
        if (visible === currentShow) {
          return;
        }

        set(currentShow);
      },
    );

    useUpdate(
      () => {
        listenerShow();
      },
      [show],
    );

    const onCloseHandle = useClosure(
      () => {
        set(!visible);
        onClose && onClose();
      },
    );

    const renderTip = useCb(
      () => {
        return (
          <Flex
            mode={COLUMN}
            align={MIDDLE}
            styleName={classnames({
              container: true,
              toast,
            })}
          >
            <Icon size="lg" {...iconProps} />
            <Show show={!!text}>
              <p styleName="text">
                {text}
              </p>
            </Show>
            <Show show={closeable}>
              <div styleName="closeable" role="button" onClick={onCloseHandle}>
                <div styleName="icon">
                  <Icon color="#fff" type="cross"/>
                </div>
              </div>
            </Show>
          </Flex>
        )
      },
    );

    // 没有子元素的模式
    if (!children) {
      return (
        <Show show={visible}>
          <div
            styleName={classnames({
              root: true,
              'no-child': true,
              fill,
            })}
          >
            {renderTip()}
          </div>
        </Show>
      )
    }

    return (
      <div styleName="root">
        <Show show={visible}>
          {renderTip()}
        </Show>
        <div styleName="content" className={className}>
          {children}
        </div>
      </div>
    );
  },
  equal,
);

Common.propsTypes = {
  text: PropTypes.any,
  toast: PropTypes.bool,
  fill: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.string,
  show: PropTypes.bool,
  iconProps: PropTypes.object,
  closeable: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Common;
