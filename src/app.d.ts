import type { Logger } from 'winston';
import type { Collection } from 'mongodb';

import type { IUserDoc } from '@/lib/user';
import type { IExpenseDoc } from '@/lib/expense';
import type { IMetadataDoc } from '@/lib/metadata';

declare global {
  function getLogger(metadata: string | object): Logger;

  function isDevServer(): boolean;
  function isProdServer(): boolean;
  function isTestServer(): boolean;

  function getCollection(name: 'users'): Collection<IUserDoc>;
  function getCollection(name: 'expenses'): Collection<IExpenseDoc>;
  function getCollection(name: 'metadata'): Collection<IMetadataDoc>;

  namespace App {
    interface Error {
      code?: string;
    }
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
