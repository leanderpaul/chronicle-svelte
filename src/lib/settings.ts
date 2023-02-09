/**
 * Importing npm packages.
 */
import sagus from 'sagus';
import { ObjectId } from 'mongodb';

/**
 * Importing user defined packages.
 */
import { Context, AppError } from '@/utils';

/**
 * Importing and defining types.
 */

export interface IExpenseGroup {
  /** Expense group ID */
  id: number;
  /** Name of the expense group */
  name: string;
  // operation: number;
  /** Words to include in expense group */
  words: string[];
}

export interface ISettingProfile {
  id: 'IN' | 'GB';
  name: string;
  currency: 'INR' | 'GBP';
}

export interface ISettings {
  /** User ID */
  uid: string;
  /** Name of the module */
  module: 'finance';
  /** Profiles maintained by the user for each country */
  profile: ISettingProfile[];
  /** Array containg the expense groups associated with the user */
  groups: IExpenseGroup[];
  /** Array containg payment methods associated with the user */
  pms: string[];
}

export type ISettingsDoc = { uid: ObjectId } & Omit<ISettings, 'uid'>;

/**
 * Declaring the constants.
 */
const logger = global.getLogger('lib:settings');
const settingsCollection = global.getCollection('settings');

function validateExpenseGroup(input: Omit<IExpenseGroup, 'id'>) {
  if (!sagus.isValid(input.name)) throw new AppError('VALIDATION_ERROR', 'Expense group name invalid');
  const words = input.words.filter((w) => sagus.isValid(w));
  return { name: input.name, words };
}

export class Settings {
  async findByUID(uid: string | ObjectId): Promise<ISettings | null> {
    if (typeof uid === 'string') uid = new ObjectId(uid);
    const settings = await settingsCollection.findOne({ uid });
    if (!settings) return null;
    return { ...settings, uid: uid.toString() };
  }

  async addPaymentmethod(paymentName: string) {
    const { uid } = Context.getCurrentUser();
    await settingsCollection.updateOne({ uid: new ObjectId(uid) }, { $push: { paymentMethods: paymentName } });
  }

  async removePaymentmethod(paymentName: string) {
    const { uid } = Context.getCurrentUser();
    await settingsCollection.updateOne({ uid: new ObjectId(uid) }, { $pull: { paymentMethods: paymentName } });
  }

  async addExpenseGroup(input: Omit<IExpenseGroup, 'id'>) {
    const { uid, settings } = Context.getCurrentUser();
    const expenseGroup = validateExpenseGroup(input);
    const lastGroup = settings.groups[settings.groups.length - 1];
    const id = lastGroup ? lastGroup.id + 1 : 1;
    await settingsCollection.updateOne({ uid: new ObjectId(uid) }, { $push: { groups: { id, ...expenseGroup } } });
  }

  async removeExpenseGroup(id: number) {
    const { uid } = Context.getCurrentUser();
    await settingsCollection.updateOne({ uid: new ObjectId(uid) }, { $pull: { groups: { id } } });
  }

  async updateExpenseGroup(id: number, input: Omit<IExpenseGroup, 'id'>) {
    const { uid } = Context.getCurrentUser();
    const expenseGroup = validateExpenseGroup(input);
    const update = { 'groups.$.name': expenseGroup.name, 'groups.$.words': expenseGroup.words };
    await settingsCollection.updateOne({ uid: new ObjectId(uid), 'groups.id': id }, { $set: update });
  }
}
