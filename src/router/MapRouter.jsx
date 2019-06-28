import React from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import '@babel/runtime-corejs2/core-js/array/is-array';

const MapRouter = ({routes}) => {
  // 验证参数 routes 必须是数组 不然执行会出错
  if (__DEV__) {
    if (!Array.isArray(routes)) {
      return null;
    }
  }

  return (
    <Switch>
      {
        routes.map((item, index) => {
          const {
            key,
            path,
            component: C,
            routes,
            ...route
          } = item;
          return (
            <Route
              // 严格验证
              exact
              // 解构放在这里是为了实现默认启用严格验证模式
              // 但可以在配置中 手动关闭 exact: false
              {...route}
              key={key || path || index}
              path={path}
              render={() => (
                <C routes={routes} />
              )}
            />
          )
        })
      }
    </Switch>
  )
};

MapRouter.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default MapRouter;
