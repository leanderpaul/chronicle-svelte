/**
 * Importing npm packages.
 */

/**
 * Importing user defined packages.
 */
import { Context } from '@/utils';

/**
 * Importing and defining types.
 */
import type { PageServerLoad } from '$routes/me/$types';

/**
 * Declaring the constants.
 */

export const load = (async () => {
  return Context.getCurrentUser();
}) satisfies PageServerLoad;
