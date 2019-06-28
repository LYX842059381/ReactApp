/**
 * 对比props 不一样 返回 false 更新组件 相同返回true 不更新
 * @param prevProps 上次更新时的props
 * @param nextProps 即将更新的 props
 * @returns {boolean}
 */
export default function equal(prevProps, nextProps) {
  const nextPropsArr = Object.keys(nextProps);
  const prevPropsArr = Object.keys(prevProps);
  let nextPropsLen = nextPropsArr.length;
  const prevPropsLen = prevPropsArr.length;

  if (nextPropsLen !== prevPropsLen) {
    return false;
  }

  while (nextPropsLen--) {
    const key = nextPropsArr[nextPropsLen];
    if (nextProps[key] !== prevProps[key]) {
      return false;
    }
  }

  return true;
};
