import uniqueId from 'lodash-unified/uniqueId';

export const uniqueIdMixin = {
  data() {
    return {
      uniqueId: uniqueId(),
      createUniqueId: uniqueId,
    };
  },
};
