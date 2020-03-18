import { TestService} from '../../src/utils/testing/testing-service';
import getSequelizeInstance from '../../src/hooks/get-sequelize-instance';
import { testContext } from '../../src/utils/testing';


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
