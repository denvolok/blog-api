import { iff, isProvider } from 'feathers-hooks-common';
import { TestService } from '../../../src/utils/testing/testing-service';
import protectPrivateArticles from '../../../src/services/articles/hooks/protect-private-articles';


const testService = new TestService();
const { app } = testService;
let service: any;

beforeAll(async () => {
  await testService.setup();
  service = app.service('tests');
  service.hooks({ after: { get: [iff(isProvider('rest'), protectPrivateArticles())] } });
});

afterAll(() => testService.destroy());


describe('\'protect-private-articles\' hook', () => {
  it('should protect private articles', async () => {
    // const user = { permissions:}
    // const article = await service.create({ title: 'Title', isPrivate: true }, { user:});
  });
});
