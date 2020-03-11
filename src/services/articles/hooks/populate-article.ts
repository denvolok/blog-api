import { Hook, HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../../../declarations';
import logger from '../../../logger';


const populateArticle = (): Hook => async (context: HookContext<ServiceModels['articles']>) => {
  if (context.result && !context.params.skipPopulation) {
    const { content: id } = context.result;

    const data = await context.app.service('uploads')
      .get(id)
      .catch((err: Error) => {
        logger.error(err);
      });

    if (data) {
      // eslint-disable-next-line no-param-reassign
      context.result.content = data.buffer.toString();
    } else {
      // eslint-disable-next-line no-param-reassign
      context.result.content = 'Content not found';
    }
  }

  return context;
};

export default populateArticle;
