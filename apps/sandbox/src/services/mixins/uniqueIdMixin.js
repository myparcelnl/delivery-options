import{ uniqueId } from 'lodash-unified';

export const uniqueIdMixin = {
  data() {
    return {
      uniqueId: uniqueId(),
      createUniqueId: uniqueId,
    };
  },
};
