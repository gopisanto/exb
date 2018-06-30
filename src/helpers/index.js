import { findIndex } from 'lodash';

/* eslint-disable */
export const getUserIndex = (users = [], userId) => findIndex(users, user => user.id === userId);
/* eslint-enable */
