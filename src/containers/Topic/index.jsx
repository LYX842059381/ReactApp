import React, {useRef} from 'react';
import PullWrapper from '@/components/Pull/Wrapper';
import Notification from '@/components/Notification';
import usePage from '@/hooks/usePage';
import {getArticle} from '@/action';
import {useParams} from '@/hooks/router';
import Header from './Header';
import Content from './Content';
import Comment from './Comment';
import './styles/style.module.less';

const Topic = () => {
  const params = useParams();
  const scroller = useRef();

  const {id} = params;

  const {
    state,
    loading,
    error,
    pageInfo,
  } = usePage({
    action: getArticle,
    key: 'article',
    id,
    params,
    url: id,
    isPage: true,
    scroller,
  });

  const {data} = state;

  return (
    <PullWrapper ref={scroller} pageInfo={pageInfo}>
      <Notification
        fill
        loading={loading}
        state={state}
        error={error}
      >
        <div styleName="topic">
          <Header data={data}/>
          <Content content={data.content}/>
          <Comment data={data.replies}/>
        </div>
      </Notification>
    </PullWrapper>
  );
};

export default Topic;
