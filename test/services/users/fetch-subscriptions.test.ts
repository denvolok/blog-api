import fetchSubscriptions from '../../../src/services/users/hooks/fetch-subscriptions';
import { testContext, testUser, testUser2 } from '../../../src/utils/testing';


describe('\'fetch-subscriptions\' hook', () => {
  it('fetches subscriptions', async () => {
    const subscriptions = [
      { ...testUser, subscribers: { createdAt: '1/11/2020', updatedAt: '2/11/2020' } },
    ];
    const subs = [
      { ...testUser2, subscribers: { createdAt: '1/11/2020', updatedAt: '2/11/2020' } },
    ];

    const context = {
      ...testContext,
      result: { ...testUser },
      params: {
        userInstance: {
          ...testUser,
          getSubscriptions: () => Promise.resolve(subscriptions),
          getSubs: () => Promise.resolve(subs),
        },
      },
    };

    const expected = {
      ...context,
      result: {
        ...context.result,
        subscriptions: [{ authorId: subscriptions[0].id, createdAt: '1/11/2020', updatedAt: '2/11/2020' }],
      },
    };
    const result = await fetchSubscriptions()(context);

    expect(result).toEqual(expected);
  });
});
