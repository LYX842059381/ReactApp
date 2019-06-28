import React, {memo, useRef} from 'react';
import PropTypes from 'prop-types';
import RefreshControl from '@/components/Pull/RefreshControl';
import Notification from '@/components/Notification';
import equal from '@/utils/equal';
import usePage from '@/hooks/usePage';
import {getTopics} from '@/action';
import ListItem from './ListItem';

const TabPanel = memo(
  ({tab}) => {
    const scroller = useRef();

    const {
      state,
      loading,
      error,
      pageInfo,
      onRefresh,
      onPullLoad,
    } = usePage({
      action: getTopics,
      key: 'topics',
      id: tab,
      params: {tab},
      pageId: tab,
      scroller,
      isPage: true,
      main: true,
    });

    return (
      <RefreshControl
        onRefresh={onRefresh}
        onPullLoad={onPullLoad}
        ref={scroller}
        pageInfo={pageInfo}
        pullLoadSwitch={!loading || !!error}
        refreshSwitch={!loading}
      >
        <Notification
          fill
          loading={loading}
          state={state}
          error={error}
        >
          {
            state.data.map(item => (
              <ListItem key={item.id} data={item}/>
            ))
          }
        </Notification>
      </RefreshControl>
    );
  },
  equal,
);

TabPanel.propTypes = {
  tab: PropTypes.string.isRequired,
};

export default TabPanel;
