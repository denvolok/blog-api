import { Hook, HookContext } from '@feathersjs/feathers';
import { isPaginated } from '../../../utils';
import searchInFile from '../../../utils/searchInFile';
import { ServiceModels } from '../../../declarations';


/**
 * TODO: handle recursion and remove 'find' method
 * Searches for the pattern in articles files if 'contentSearch' in the query.
 * Sets the 'result' field, so the service method call will be skipped.
 */
const contentSearch = (): Hook => async (context: HookContext<ServiceModels['articles']>) => {
  const { app, params } = context;
  const { query = {} } = params;
  const { contentSearch: search } = query;

  delete query.contentSearch;
  delete params.provider;

  const result = await app.service('articles').find(params);

  if (search && isPaginated<ServiceModels['articles']>(result)) {
    const promises = result.data.map((article) => searchInFile(article.content, search));
    const searchResults = await Promise.all(promises);

    result.data = result.data
      // Populate article objects with search data
      .map((article, i) => ({ ...article, search: searchResults[i] }))
      // Filter matching articles
      .filter((article) => !!article.search);
  }

  // eslint-disable-next-line no-param-reassign
  context.result = result;
  return context;
};

export default contentSearch;
