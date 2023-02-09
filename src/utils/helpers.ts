/**
 * Importing npm packages.
 */

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */
import type { IExpenseItem } from '@/lib';

/**
 * Declaring the constants.
 */

export function calculateTotal(items: IExpenseItem[]) {
  return items.reduce((acc, item) => acc + Math.round(item.price * 100 * (item.qty || 1)), 0) / 100;
}
