/**
 * Importing npm packages.
 */
import sagus from 'sagus';
import { ObjectId } from 'mongodb';

/**
 * Importing user defined packages.
 */
import { Utils, Context, calculateTotal, AppError } from '@/utils';
import { Library } from '@/lib';

/**
 * Importing and defining types.
 */

export interface IExpenseItem {
  /** Name of the expense or bill item */
  name: string;
  /** The price for which the item is sold for */
  price: number;
  /** The quantity of the otem purchased, if this value is empty it means the quantity is one */
  qty?: number;
}

export interface IExpense {
  /** Expense ID ID of the  */
  eid: string;
  /** User Profile ID to whom this expense is associated with. It's value is '<User ID>-<User Profile ID>' */
  upid: string;
  /** Bill ID that is mentioned in the bill or invoice */
  bid?: string;
  /** Name of the store from which this bill or invoice is issued */
  store: string;
  /** The date on which the bill or invoice was issued */
  date: number;
  /** Array containing the items that are in the bill */
  items: IExpenseItem[];
  /** payment method used to pay for this expense */
  pm?: string;
  /** Description of the expense */
  desc?: string;
  /** Total amount of the expense sent. It is the sum of the price of all the items in the bill */
  total: number;
}

export type IExpenseDoc = Omit<IExpense, 'eid'>;

/**
 * Declaring the constants.
 */
const logger = global.getLogger('models:expense');
const expenseCollection = global.getCollection('expenses');

function validateExpense(input: Omit<IExpense, 'upid' | 'eid' | 'total'>) {
  const items = input.items.filter((item) => item.qty === undefined || item.qty > 0);
  if (!sagus.isValid(input.store)) throw new AppError('VALIDATION_ERROR', 'Invalid store');
  if (input.date < 2200) throw new AppError('VALIDATION_ERROR', 'Invalid date');
  if (items.some((i) => !sagus.isValid(i.name))) throw new AppError('VALIDATION_ERROR', 'Expense item name invalid');

  const obj = {
    bid: sagus.isValid(input.bid) ? input.bid.trim() : null,
    date: input.date,
    store: input.store.trim(),
    items: items.map((i) => ({ ...i, qty: i.qty && i.qty === 1 ? null : i.qty })),
    pm: sagus.isValid(input.pm) ? input.pm.trim() : null,
    total: calculateTotal(input.items),
    desc: sagus.isValid(input.desc) ? input.desc.trim() : null,
  };

  return sagus.trimObject(obj) as Omit<IExpense, 'eid' | 'upid'>;
}

export class Expense {
  async list(): Promise<IExpense[]> {
    const skip = 0;
    const limit = 20;
    const { uid, profile } = Context.getCurrentUser();
    const upid = Utils.getUPID(uid, profile);
    const expenses = await expenseCollection.find({ upid }, { sort: { date: -1 }, limit, skip }).toArray();
    return expenses.map((obj) => ({ eid: obj._id.toString(), ...sagus.removeKeys(obj, ['_id']) }));
  }

  async findByID(eid: ObjectId | string): Promise<IExpense | null> {
    const { uid, profile } = Context.getCurrentUser();
    const upid = Utils.getUPID(uid, profile);
    if (typeof eid === 'string') eid = new ObjectId(eid);
    const expense = await expenseCollection.findOne({ _id: eid, upid });
    if (!expense) return null;
    const obj = sagus.removeKeys(expense, ['_id']);
    return { eid: expense._id.toString(), ...obj };
  }

  async add(input: Omit<IExpense, 'upid' | 'eid' | 'total'>): Promise<IExpense> {
    const { uid, profile } = Context.getCurrentUser();
    const upid = Utils.getUPID(uid, profile);
    const obj = validateExpense(input);
    const expense = { upid, ...obj };
    const result = await expenseCollection.insertOne(expense);
    await Library.metadata.incrementBillCounter(upid, 1);
    return { eid: result.insertedId.toString(), ...expense };
  }

  async update(eid: string | ObjectId, update: Omit<IExpense, 'upid' | 'eid' | 'total'>) {
    const { uid, profile } = Context.getCurrentUser();
    const upid = Utils.getUPID(uid, profile);
    if (typeof eid === 'string') eid = new ObjectId(eid);
    const updatedExpense = validateExpense(update);
    await expenseCollection.updateOne({ _id: eid, upid }, { $set: updatedExpense });
    return { eid: eid.toString(), upid, ...updatedExpense };
  }

  async delete(eid: string | ObjectId) {
    const { uid, profile } = Context.getCurrentUser();
    const upid = Utils.getUPID(uid, profile);
    if (typeof eid === 'string') eid = new ObjectId(eid);
    await expenseCollection.deleteOne({ _id: eid, upid });
    await Library.metadata.incrementBillCounter(upid, -1);
  }
}
