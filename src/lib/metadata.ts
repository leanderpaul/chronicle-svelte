/**
 * Importing npm packages.
 */
import sagus from 'sagus';

/**
 * Importing user defined packages.
 */

/**
 * Importing and defining types.
 */

export interface IMetadata {
  /** User Profile ID to whom this expense is associated with. It's value is '<User ID>-<User Profile ID>' */
  upid: string;
  /** The name of the module that is using this document */
  module: 'finance';
  /** The total count of the expenses or bills that the user has added */
  billCount: number;
}

export type IMetadataDoc = IMetadata;

/**
 * Declaring the constants.
 */
const logger = global.getLogger('lib:metadata');
const metadataCollection = global.getCollection('metadata');

export class Metadata {
  async findByUPID(upid: string): Promise<IMetadata | null> {
    const metadata = await metadataCollection.findOne({ upid });
    if (!metadata) return null;
    return sagus.removeKeys(metadata, ['_id']);
  }

  async incrementBillCounter(upid: string, val = 1) {
    await metadataCollection.updateOne({ upid }, { $inc: { billCount: val } });
  }
}
