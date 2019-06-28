import React, {memo} from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Show from '@/components/Show';
import equal from '@/utils/equal';
import Spin from './Spin';
import Empty from './Empty';
import ErrorTip from './ErrorTip';

const Notification = memo(
  (props) => {
    const {
      loading,
      error,
      state,
      children,
      ...other
    } = props;

    const checkEmpty = () => {
      if (loading || error || !state.isMounted) {
        return false;
      }
      if (isEmpty(state.data)) {
        return true;
      }
    };

    const renderChild = () => {
      if (!state.isMounted) {
        return null;
      }
      return children;
    };

    if (loading) {
      return (
        <Spin
          {...other}
          children={renderChild()}
          loading={loading}
        />
      )
    }

    if (error) {
      return (
        <ErrorTip
          {...other}
          children={renderChild()}
          error={error}
        />
      )
    }

    if (checkEmpty()) {
      return <Empty/>
    }

    return (
      <Show show={!!children}>
        <Spin
          {...other}
          children={renderChild()}
          loading={false}
        />
      </Show>
    )
  },
  equal,
);

Notification.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  children: PropTypes.any,
  state: PropTypes.object.isRequired,
};

export default Notification;
