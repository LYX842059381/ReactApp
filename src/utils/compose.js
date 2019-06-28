export class ComposeResult {
  constructor(...args) {
    this.args = args;
  }

  toArray() {
    return this.args;
  }
}

export default (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => {
    return (...args) => {
      const res = b(...args);
      if (res instanceof ComposeResult) {
        return a(...res.toArray());
      }
      return a(res);
    };
  });
};
