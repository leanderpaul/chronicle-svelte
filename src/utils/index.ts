/**
 * Importing npm packages.
 */
import sagus from 'sagus';
import cookie from 'cookie';
import crypto from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Importing user defined packages.
 */
import { calculateTotal } from './helpers';
import { SECRET_KEY, AppError, AUTH } from './constants';

/**
 * Importing and defining types.
 */
import type { RequestEvent } from '@sveltejs/kit';
import type { CookieSerializeOptions } from 'cookie';
import type { IUser, IUserSession, ISettings, ISettingProfile } from '@/lib';

const logger = global.getLogger('utils:index');

/****************************************** Validators *******************************************/

export const Validator = {
  isEmail(email: string) {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  },

  isName(name: string) {
    return /^[a-zA-Z\ ]{3,32}$/.test(name);
  },

  isPassword(password: string) {
    return /[a-zA-Z0-9@\-_$#&!]{8,32}/.test(password);
  },
};

/******************************************** Crypto *********************************************/

export const Crypto = {
  encrypt(iv: string | Buffer, secretKey: keyof typeof SECRET_KEY, input: string) {
    const biv = typeof iv === 'string' ? Buffer.from(iv, 'base64') : iv;
    const cipher = crypto.createCipheriv('aes-256-ctr', SECRET_KEY[secretKey], biv);
    const result = Buffer.concat([cipher.update(input), cipher.final()]);
    return result.toString('base64');
  },
  decrypt(iv: string | Buffer, secretKey: keyof typeof SECRET_KEY, encryptedinput: string) {
    const biv = typeof iv === 'string' ? Buffer.from(iv, 'base64') : iv;
    const decipher = crypto.createDecipheriv('aes-256-ctr', SECRET_KEY[secretKey], biv);
    const result = Buffer.concat([decipher.update(Buffer.from(encryptedinput, 'base64')), decipher.final()]);
    return result.toString();
  },
};

/**************************************** Request Context ****************************************/

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export const Context = {
  init<T>(event: RequestEvent, callback: () => T): T {
    return asyncLocalStorage.run(new Map(), () => {
      const store = asyncLocalStorage.getStore()!;
      store.set('RID', sagus.genUUID());
      store.set('CURRENT_REQUEST_EVENT', event);
      return callback();
    });
  },

  getRID(): string {
    return asyncLocalStorage.getStore()!.get('RID');
  },

  getCurrentRequest(): RequestEvent {
    return asyncLocalStorage.getStore()!.get('CURRENT_REQUEST_EVENT');
  },

  getCurrentUser(): IUser & { settings: ISettings | null; profile: ISettingProfile | null } {
    return asyncLocalStorage.getStore()!.get('CURRENT_USER');
  },

  setCurrentUser(user: IUser, settings: ISettings | null, profile: ISettingProfile | null) {
    const obj = { ...user, settings, profile };
    asyncLocalStorage.getStore()!.set('CURRENT_USER', obj);
  },

  getCurrentSession(): IUserSession {
    return asyncLocalStorage.getStore()!.get('CURRENT_USER_SESSION');
  },

  setCurrentSession(session: IUserSession) {
    asyncLocalStorage.getStore()!.set('CURRENT_USER_SESSION', session);
  },
};

/********************************************* Utils *********************************************/

export const Utils = {
  getUPID(uid: string, profile: ISettingProfile) {
    return uid + '-' + profile.id;
  },

  encodeCookie(uid: string, sid: string) {
    return uid + '|' + sid;
  },

  decodeCookie(cookie: string) {
    const data = cookie.split('|');
    return { uid: data[0]!, sid: data[1]! };
  },
};

export { SECRET_KEY, AppError, calculateTotal, AUTH };
