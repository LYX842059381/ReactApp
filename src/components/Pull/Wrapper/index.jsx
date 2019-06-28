import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import useMount from 'react-use/lib/useMount';
import Flex from '@/components/Flex';
import useCheckBack from '@/hooks/useCheckBack';
import {COLUMN, FILL} from '@/utils/constant';
import './styles/style.module.less';

const Wrapper = forwardRef(
  ({className, pageInfo, ...props}, ref) => {
    const isBack = useCheckBack();

    useMount(
      () => {
        const dom = ref && ref.current;
        if (!pageInfo || !dom || !isBack) {
          return;
        }

        dom.scrollTo(pageInfo.scrollX, pageInfo.scrollY);
      },
    );

    return (
      <Flex
        flex={1}
        ref={ref}
        mode={COLUMN}
        size={FILL}
        styleName="pull-wrapper"
        className={className}
        {...props}
      />
    )
  },
);

Wrapper.propTypes = {
  className: PropTypes.string,
  pageInfo: PropTypes.object,
};

export default Wrapper;
