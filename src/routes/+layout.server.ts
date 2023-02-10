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
import type { LayoutServerLoad } from '$routes/$types';

/**
 * Declaring the constants.
 */

export const load = (async () => {
  return Context.getCurrentUser();
}) satisfies LayoutServerLoad;
