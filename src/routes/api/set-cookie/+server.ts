/**
 * Importing npm packages.
 */
import sagus from 'sagus';
import { json, error } from '@sveltejs/kit';

/**
 * Importing user defined packages.
 */
import { Library } from '@/lib';
import { Context, AUTH, Utils } from '@/utils';

/**
 * Importing and defining types.
 */
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Declaring the constants.
 */
const logger = global.getLogger('api:set-cookie');

const email = 'test-user@mail.com';
const name = 'Test User';
const password = 'Password@123';

export const GET: RequestHandler = async (event) => {
  if (global.isProdServer()) throw error(404, { message: 'Page not Found' });

  const u = Context.getCurrentUser();
  if (u) {
    const session = Context.getCurrentSession();
    const csrfToken = Library.user.generateCSRFToken(session.id);
    return 'password' in u
      ? json({ csrfToken, user: sagus.removeKeys(u, ['password']) })
      : json({ csrfToken, user: sagus.removeKeys(u, ['refreshToken', 'spuid']) });
  }

  let user = await Library.user.findByEmail(email);
  user = await (user ? Library.user.login({ email, password }) : Library.user.register({ email, name, password }));
  const session = Context.getCurrentSession();
  const csrfToken = Library.user.generateCSRFToken(session.id);
  const cookie = Utils.encodeCookie(user.uid, session.id);
  event.cookies.set(AUTH.COOKIE_NAME, cookie, { maxAge: AUTH.COOKIE_MAX_AGE, secure: global.isProdServer(), path: '/' });
  return json({ csrfToken, user: { email, name, password } });
};
