import { Hook, HookContext } from '@feathersjs/feathers';
import logger from '../../../logger';


/**
 * Removes article content files.
 */
const removeContentFiles = (): Hook => (context: HookContext) => {
  const { app } = context;
  const article = context.result;

  if (article instanceof Array) {
    const promises = article.map((a) => app.service('uploads').remove(a.content));

    Promise.all(promises)
      .then(() => {
        logger.info(`${promises.length} content files successfully deleted`);
      })
      .catch(logger.error);
  } else {
    app.service('uploads').remove(article.content);
  }

  return context;
};


export default removeContentFiles;
