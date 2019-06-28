import React, {Children, memo} from 'react';
import PropTypes from 'prop-types';
import CloneElement from '@/components/CloneElement';
import equal from '@/utils/equal';

const Show = memo(
  ({show, children, ...other}) => {
    if (!show || !children) {
      return null;
    }

    return (
      <CloneElement component={Children.only(children)} {...other}>
        {Children.only(children).props.children}
      </CloneElement>
    )
  },
  equal,
);

Show.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element,
};

export default Show;
