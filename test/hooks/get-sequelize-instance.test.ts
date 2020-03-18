import { TestService, testContext } from '../../src/utils/testing/test-utils';
import getSequelizeInstance from '../../src/hooks/get-sequelize-instance';


const testApp = new TestService('sequelize');

beforeAll(() => testApp.setup());
afterAll(() => testApp.destroy());


describe('\'get-sequelize-instance\' hook', () => {
  it('retrieves and passes sequelize instance', async () => {
    const service = testApp.app.service('tests');
    const context = { ...testContext, id: 1, service };
    const model = service.getModel({});

    await service.create({});
    const result = await getSequelizeInstance({ key: 'testInstance' })(context);

    expect(result && result.params.testInstance).toBeInstanceOf(model);
  });
});
