/**
 * Importing npm packages.
 */

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
import type { User, IUser, IUserSession } from './user';
import type { Expense, IExpense, IExpenseItem } from './expense';
import type { Settings, IExpenseGroup, ISettingProfile, ISettings } from './settings';
import type { Metadata, IMetadata } from './metadata';

interface ILibrary {
  user: User;
  expense: Expense;
  settings: Settings;
  metadata: Metadata;
}

/**
 * Declaring the constants.
 */
const logger = global.getLogger('library');

let Library: ILibrary = {
  user: null as any,
  expense: null as any,
  settings: null as any,
  metadata: null as any,
};

async function initLibrary() {
  if (Library.user || Library.expense) {
    logger.warn('Library already initiated');
  }
  const { User } = await import('./user');
  const { Expense } = await import('./expense');
  const { Settings } = await import('./settings');
  const { Metadata } = await import('./metadata');
  Library = { user: new User(), expense: new Expense(), settings: new Settings(), metadata: new Metadata() };
  Object.freeze(Library);
  logger.debug('Library intiated');
  return Library;
}

export type { IUser, IUserSession, IExpense, IExpenseItem, ISettings, ISettingProfile, IExpenseGroup, IMetadata };

export { Library, initLibrary };
export default Library;
