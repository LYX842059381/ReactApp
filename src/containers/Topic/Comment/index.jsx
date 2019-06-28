import React, {memo} from 'react';
import PropTypes from 'prop-types';
import equal from '@/utils/equal';
import Header from './Header';
import ListItem from './ListItem';

const Comment = memo(
  ({data}) => {
    return (
      <div>
        <Header count={data.length} />
        <div>
          {
            data.map((item, index) => (
              <ListItem index={index} data={item} key={item.id} />
            ))
          }
        </div>
      </div>
    );
  },
  equal,
);

Comment.propTypes = {
  data: PropTypes.array,
};

export default Comment;
