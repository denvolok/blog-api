import { HookContext } from '@feathersjs/feathers';


export const testContext: HookContext = {
// @ts-ignore
  app: {},
  data: {},
  id: '',
  params: {},
  result: {},
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
