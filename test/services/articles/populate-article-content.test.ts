import { TestService } from '../../../src/utils/testing/testing-service';
import populateArticleContent from '../../../src/services/articles/hooks/populate-article-content';

const testService = new TestService('memory', ['uploads']);
const { app } = testService;
let service: any;


beforeAll(async () => {
  await testService.setup();
});

afterAll(async () => {
  await testService.destroy();
});


describe('\'populate-article-content\' hook', () => {
  beforeAll(() => {
    service = app.service('tests');
    service.hooks({ after: { create: [populateArticleContent()] } });
  });

  it('should populate article content', async () => {
    const content = 'Interesting article content';
    const file = await testService.createTextFile(content);

    const article = await service.create({ title: 'title', content: file.id });

    expect(article.content).toBe(content);
  });

  it('should skip population', async () => {
    const content = 'Interesting article content';
    const file = await testService.createTextFile(content);

    const article = await service.create({ title: 'title', content: file.id }, { skipPopulation: true });

    expect(article.content).toBe(file.id);
  });
});
