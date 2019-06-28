import curry from 'lodash/curry';

export const actionCreater = curry(
  async (type, response) => {
    const result = await response;

    return {
      ...result,
      type,
    };
  },
);
