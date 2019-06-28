import React, {useState} from 'react';
import {
  Icon,
} from 'antd-mobile';
import {Link} from 'react-router-dom';
import Flex from '@/components/Flex';
import MapRouter from '@/router/MapRouter';
import useCb from '@/hooks/useCb';
import useClosure from '@/hooks/useClosure';
import {COLUMN, FILL, MIDDLE} from '@/utils/constant';
import useCheckBack from '@/hooks/useCheckBack';
import Wrapper from './Wrapper';
import logo from './images/logo.svg';
import './styles/style.module.less';

let prevValue = '';

const NavBar = (props) => {
  // 是否返回
  const isBack = useCheckBack();

  const [value, set] = useState(isBack ? prevValue : '');

  const onChange = useCb(
    (e) => {
      const {value: content} = e.target;
      set(content);
      // 返回时恢复状态使用
      prevValue = content;
    }
  );

  const onSubmit = useClosure(
    (e) => {
      e.preventDefault();
      // 使用 google 搜索
      window.location.href = `https://www.google.com.hk/search?hl=zh-CN&q=site:cnodejs.org+${value.trim()}&cad=h`;
    },
  );

  return (
    <Flex mode={COLUMN} size={FILL}>
      <Wrapper>
        <Flex align={MIDDLE} styleName="navbar">
          <Flex component={Link} to="/" flex={0} styleName="logo">
            <img src={logo} alt="logo"/>
          </Flex>
          <Flex
            align={MIDDLE}
            styleName="search"
            component="form"
            flex={1}
            onSubmit={onSubmit}
          >
            <Icon styleName="icon" color="#444" type="search" size="xs"/>
            <input
              type="search"
              value={value}
              onChange={onChange}
            />
          </Flex>
        </Flex>
      </Wrapper>
      <MapRouter {...props} />
    </Flex>
  )
};

export default NavBar;
