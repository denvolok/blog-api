import cloneDeep from 'lodash/cloneDeep';
import { limitToUserHandler } from '../../src/hooks/error-handlers';
import { testContext } from '../../src/utils/testing';


describe('\'error-handlers\' hooks', () => {
  const context = cloneDeep(testContext);

  context.params.limitedToUser = true;


  describe('\'limitToUserHandler\'', () => {
    it('doesn\'t modify params', () => {
      const expected = cloneDeep(context);
      const result = limitToUserHandler()(context);

      expect(result).toEqual(expected);
    });

    it('updates error message', () => {
      context.error = { message: '' };

      const result = limitToUserHandler()(context);

      // @ts-ignore
      expect(result.error.message).toEqual(expect.stringContaining('limited to the user'));
    });
  });
});
