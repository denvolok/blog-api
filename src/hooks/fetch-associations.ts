import { Hook, HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../declarations';


/**
 * Populates provided associated models via sequelize 'include'.
 */
const fetchAssociations = (...models: (keyof ServiceModels)[]): Hook => (context: HookContext) => {
  const params = {
    ...context.params,
    sequelize: {
      ...context.params.sequelize,
      raw: false,
      include: [],
    },
  };

  models.forEach((model) => {
    params.sequelize.include
      .push(context.app.service(model).getModel());
  });

  // eslint-disable-next-line no-param-reassign
  context.params = params;
  return context;
};


export default fetchAssociations;
