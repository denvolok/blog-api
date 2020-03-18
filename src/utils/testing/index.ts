import { HookContext } from '@feathersjs/feathers';

export const testContext: HookContext = {
// @ts-ignore
  app: {},
  data: { id: 1 },
  id: '1',
  params: { query: { name: 'bob' }, provider: 'rest', testField: 'str' },
  result: { name: 'bob', email: 'bob@dev.com' },
};

export const testUser = {
  id: 1,
  email: 'first@dev.com',
  permissions: ['follower'],
  createdAt: '13/03/2020',
  updatedAt: '15/03/2020',
  comments: [],
  articles: [],
};

export const testUser2 = {
  ...testUser,
  id: 2,
  email: 'second@dev.com',
  permissions: ['author'],
};
