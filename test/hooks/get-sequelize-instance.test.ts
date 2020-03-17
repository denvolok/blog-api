import { testContext, TestService } from '../../src/utils/testing/test-utils';
import getSequelizeInstance from '../../src/hooks/get-sequelize-instance';


const testService = new TestService();

beforeAll(() => testService.setup());
afterAll(() => testService.destroy());


describe('\'get-sequelize-instance\' hook', () => {
  it('retrieves and passes sequelize instance', async () => {
    const context = { ...testContext, id: 1, service: testService.app.service('tests') };
    const model = testService.app.service('tests').getModel({});

    await testService.app.service('tests').create({});
    const result = await getSequelizeInstance({ key: 'testInstance' })(context);

    expect(result && result.params.testInstance).toBeInstanceOf(model);
  });
});
