import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.module.less';

const List = (props) => {
  const {header, children, className} = props;
  return (
    <div styleName="root" className={className}>
      {header}
      <div styleName="list">
        {children}
      </div>
    </div>
  );
};

List.propTypes = {
  header: PropTypes.element,
  children: PropTypes.any,
  className: PropTypes.string,
};

export default List;
