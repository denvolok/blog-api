import { Hook, HookContext } from '@feathersjs/feathers';
import { ServiceModels } from '../../../declarations';
import logger from '../../../logger';


/**
 * Creates or updates files with articles content.
 */
const updateArticleContentFile = (): Hook => async (context: HookContext<ServiceModels['articles']>) => {
  if (context.type === 'before' && context.data && context.data.content) {
    const { app } = context;
    const { content } = context.data;
    let { title } = context.data;


    // Remove old file if needed
    if (context.method === 'patch' || context.method === 'update') {
      const oldArticle = await app.service('articles').get(context.id, { ...context.params, skipPopulation: true });

      await app.service('uploads')
        .remove(oldArticle.content)
        .catch(logger.error);

      title = title || oldArticle.title;
    }

    // Create new one
    const path = `uploads/articles/${title.replace(/\s/g, '_')}.${Date.now()}.txt`;
    const file = await context.app.service('uploads').create({
      id: path,
      buffer: Buffer.from(content),
      contentType: 'text/plain',
    });

    // eslint-disable-next-line no-param-reassign
    context.data.content = file.id;
  }

  return context;
};

export default updateArticleContentFile;
