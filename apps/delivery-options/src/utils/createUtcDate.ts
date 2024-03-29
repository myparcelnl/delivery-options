import {type DateLike, normalizeDate} from '@vueuse/core';

export const createUtcDate = (date?: DateLike) => {
  const resolvedDate = normalizeDate(date ?? new Date());

  return new Date(Date.UTC(resolvedDate.getFullYear(), resolvedDate.getMonth(), resolvedDate.getDate()));
};
