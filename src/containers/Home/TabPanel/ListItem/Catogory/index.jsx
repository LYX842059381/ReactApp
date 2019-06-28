import React, {memo} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Flex from '@/components/Flex';
import Show from '@/components/Show';
import equal from '@/utils/equal';
import {getCatogory} from '@/utils/utils';
import './styles/style.module.less';

const Catogory = memo(
  (props) => {
    const {
      good,
      top,
      tab,
      className,
    } = props;

    const currentTab = getCatogory(tab, top, good);

    return (
      <Show show={!!currentTab}>
        <Flex
          className={className}
          flex={0}
          styleName={classnames({
            catogory: true,
            top: top || good,
          })}
        >
          {currentTab}
        </Flex>
      </Show>
    );
  },
  equal,
);

Catogory.propTypes = {
  good: PropTypes.bool,
  top: PropTypes.bool,
  tab: PropTypes.string,
  className: PropTypes.string,
};

export default Catogory;
