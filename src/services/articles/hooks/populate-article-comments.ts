import { Hook, HookContext } from '@feathersjs/feathers';


const populateArticleComments = (): Hook => (context: HookContext) => {
  const { params } = context;

  // eslint-disable-next-line no-param-reassign
  context.params = {
    ...params,
    sequelize: {
      ...params.sequelize,
      raw: false,
      include: context.app.service('comments').getModel(params),
    },
  };

  return context;
};


export default populateArticleComments;
