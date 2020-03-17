import { protectTimestamps } from '../../src/hooks/common';
import { testContext } from '../../src/utils/testing/test-utils';

/**
 * @c-pragma c-value
 */
describe('\'common\' hooks', () => {
  it('\'protectTimestamps\'', async () => {
    const val = { id: 1, createdAt: '1/11/2020' };
    const val2 = { id: 1, updatedAt: '1/11/2020' };

    expect(() => {
      protectTimestamps(val, testContext);
    }).toThrow();

    expect(() => {
      protectTimestamps(val2, testContext);
    }).toThrow();
  });
});
