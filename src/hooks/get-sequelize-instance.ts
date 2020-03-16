import { Hook, HookContext, Id } from '@feathersjs/feathers';


interface Params {
  id?: Id;
  key: string;
}

/**
 * Fetches sequelize instance(instead of 'raw' object by default) and passes it through 'params'.
 * The instance also will be available in the 'after' hooks.
 * Use for 'get' and 'remove' methods, 'multi' not supported.
 *
 * @param {id} id - instance 'id' for 'get' method
 * @param {string} key - instance will be stored under 'context.params[key]'
 */
const getSequelizeInstance = ({ id, key }: Params): Hook => async (context: HookContext) => {
  const { service } = context;
  const entityId = id || context.id || 0;

  // eslint-disable-next-line no-param-reassign
  context.params[key] = await service.get(entityId, { sequelize: { raw: false } });

  return context;
};


export default getSequelizeInstance;
