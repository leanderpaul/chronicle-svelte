/**
 * Importing npm packages.
 */
import { json } from '@sveltejs/kit';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Declaring the constants.
 */

export const GET = (async () => {
  return json({ msg: 'Server Working' });
}) satisfies RequestHandler;
