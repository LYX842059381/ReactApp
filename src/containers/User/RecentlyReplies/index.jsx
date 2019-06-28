import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@/containers/Home/TabPanel/ListItem';
import ListHeader from '../ListHeader';
import List from '../List';

const RecentlyReplies = ({data}) => {
  return (
    <List
      header={<ListHeader text="最近参与的话题" />}
    >
      {
        data.map(item => (
          <ListItem data={item} key={item.id} />
        ))
      }
    </List>
  );
};

RecentlyReplies.propTypes = {
  data: PropTypes.array,
};

export default RecentlyReplies;
