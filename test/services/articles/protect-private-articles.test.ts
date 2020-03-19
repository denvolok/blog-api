import { Forbidden } from '@feathersjs/errors';
import { TestService } from '../../../src/utils/testing/testing-service';
import protectPrivateArticles from '../../../src/services/articles/hooks/protect-private-articles';


const testService = new TestService();
const { app } = testService;
let service: any;

beforeAll(async () => {
  await testService.setup();
  service = app.service('tests');
  service.hooks({ after: { get: [protectPrivateArticles()] } });
});

afterAll(() => testService.destroy());


describe('\'protect-private-articles\' hook', () => {
  const user = { subscriptions: [{ authorId: 5 }, { authorId: 6 }] };

  it('should throw an error', async () => {
    const article = await service.create({ title: 'Title', isPrivate: true, userId: 4 });

    await expect(service.get(article.id)).rejects.toBeInstanceOf(Forbidden);
    await expect(service.get(article.id, { user })).rejects.toBeInstanceOf(Forbidden);
  });

  it('should\'n t throw an error', async () => {
    const [publicArticle, privateArticle] = await Promise.all([
      service.create({ title: 'Title', isPrivate: false, userId: 5 }),
      service.create({ title: 'Title', isPrivate: true, userId: 5 }),
    ]);

    await expect(service.get(publicArticle.id)).resolves.toBeTruthy();
    await expect(service.get(privateArticle.id, { user })).resolves.toBeTruthy();
  });
});
