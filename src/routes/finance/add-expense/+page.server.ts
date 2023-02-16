/**
 * Importing npm packages.
 */

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
import type { Actions } from '$routes/finance/add-expense/$types';

/**
 * Declaring the constants.
 */

export const actions = {
  default: async function (action) {
    const data = await action.request.formData();

    const eid = data.get('eid');
    const store = data.get('store');
    const date = data.get('date');
    const items = data.get('items');
    const pm = data.get('payment-mode');
    const desc = data.get('desc');
    const currency = data.get('currency');
    console.log({ eid, store, date, items, pm, desc, currency });
  },
} satisfies Actions;
