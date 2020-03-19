import { iff, isProvider } from 'feathers-hooks-common';
import { TestService } from '../../../src/utils/testing/testing-service';
import contentSearch from '../../../src/services/articles/hooks/content-search';
import { testContext } from '../../../src/utils/testing';


const testService = new TestService(['uploads']);
const { app } = testService;
let service: any;


beforeAll(async () => {
  await testService.setup();

  testService.useMemory('/articles');
  service = app.service('articles');
  service.hooks({ before: { find: [iff(isProvider('rest'), contentSearch())] } });
});

afterAll(async () => {
  await testService.destroy();
});


describe('\'contentSearch\' hook', () => {
  it('should find search matches', async () => {
    const content = 'Article content\nLine with foo string';

    const file = await testService.createTextFile(content);
    const article = await service.create({ title: 'title', content: file.id });

    const result = await service.find({ query: { id: article.id, contentSearch: 'foo' }, provider: 'rest' });
    const expected = { lines: ['Line with foo string'] };

    expect(result.data[0].search).toEqual(expected);
  });

  it('shouldn\'t find search matches', async () => {
    const content = 'Article content\nLine with foobar string';

    const file = await testService.createTextFile(content);
    const article = await service.create({ title: 'title', content: file.id });

    const result = await service.find({ query: { id: article.id, contentSearch: 'foo' }, provider: 'rest' });

    expect(result.data.length).toBe(0);
    expect(result.total).toEqual(0);
  });

  it('should remove \'contentSearch\' query parameter', async () => {
    const context = { ...testContext, app };
    context.params.query = { id: 1, contentSearch: 'foo' };

    const result = await contentSearch()(context);

    // @ts-ignore
    expect(result.params.query).toEqual(expect.not.objectContaining({ contentSearch: 'foo' }));
  });
});
