import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@/containers/Home/TabPanel/ListItem';
import ListHeader from '../ListHeader';
import List from '../List';

const RecentlyTopics = ({data}) => {
  return (
    <List
      header={<ListHeader text="最近创建的话题" />}
    >
      {
        data.map(item => (
          <ListItem data={item} key={item.id} />
        ))
      }
    </List>
  );
};

RecentlyTopics.propTypes = {
  data: PropTypes.array,
};

export default RecentlyTopics;
