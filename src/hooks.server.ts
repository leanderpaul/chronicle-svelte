/**
 * Importing npm packages.
 */
import winston from 'winston';
import { error } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';

/**
 * Importing and defining types.
 */
import type { Handle } from '@sveltejs/kit';

/**************************************** Gloabal Methods ****************************************/

global.isDevServer = () => (process.env.NODE_ENV || 'development') === 'development';
global.isProdServer = () => process.env.NODE_ENV === 'production';
global.isTestServer = () => process.env.NODE_ENV === 'test';

/******************************************** Logger *********************************************/

const VALID_LOG_LEVELS = ['silly', 'debug', 'http', 'info', 'warn', 'error'];
const LOG_COLOR_FORMAT = { info: 'green', error: 'bold red', warn: 'italic yellow', debug: 'magenta', http: 'blue' };

const { Console, File } = winston.transports;
const { combine, printf, errors, timestamp, colorize, json } = winston.format;
const logLevel = VALID_LOG_LEVELS.includes(process.env.LOG_LEVEL || '') ? process.env.LOG_LEVEL : 'http';

const jsonFormat = combine(errors({ stack: true }), json());
const consoleColor = colorize({ level: true, colors: LOG_COLOR_FORMAT });
const consoleFormat = printf(({ level, message, timestamp, service }) => `${timestamp} ${level}: [${service}] ${message}`);
const consoleLogFormat = combine(timestamp({ format: 'HH:mm:ss:SS' }), errors({ stack: true }), consoleColor, consoleFormat);
const fileLogFormat = combine(timestamp({ format: 'HH:mm:ss:SS' }), errors({ stack: true }), json());
const logger = winston.createLogger({ level: logLevel, format: jsonFormat, defaultMeta: { service: 'server' } });

if (global.isDevServer() || logLevel === 'debug') logger.add(new Console({ format: consoleLogFormat }));
logger.add(new File({ format: fileLogFormat, filename: `chronicle.log` }));

global.getLogger = (metadata) => (typeof metadata === 'string' ? logger.child({ service: metadata }) : logger.child({ ...metadata }));

/******************************************* Database ********************************************/

const DB_URI = process.env.DB_URI || 'mongodb://localhost/chronicle';
const DB_COLLECTION_NAMES = ['users', 'expenses', 'settings', 'metadata'] as const;

const mongoClient = new MongoClient(DB_URI);
const db = mongoClient.db();

await mongoClient.connect();
logger.info(`connected to database`);

/** Creating the collections */
const existingCollections = await db.collections();
const existingCollectionNames = existingCollections.map((c) => c.collectionName);
for (let index = 0; index < DB_COLLECTION_NAMES.length; index++) {
  const collectionName = DB_COLLECTION_NAMES[index]!;
  const collectionExists = existingCollectionNames.includes(collectionName);
  if (!collectionExists) await db.createCollection(collectionName);
  logger.info(`collection '${collectionName}' ${collectionExists ? 'already exists' : 'created'}`);
}

/** Storing the collection object */
const collections = {
  users: db.collection('users'),
  expenses: db.collection('expenses'),
  settings: db.collection('settings'),
  metadata: db.collection('metadata'),
};

/** Creating indexes for each collection if not present */
const usersIndexes = await collections.users.indexes();
const usersIndexOpts = { unique: true, background: true, name: 'UNIQUE_EMAIL_INDEX' };
const usersIndexExists = usersIndexes.find((index) => index.name === usersIndexOpts.name);
if (!usersIndexExists) await collections.users.createIndex({ email: 1 }, usersIndexOpts);

const expensesIndexes = await collections.expenses.indexes();
const expensesIndexOpts = { unique: true, background: true, name: 'UNIQUE_UPID_AND_EID_INDEX' };
const expensesIndexExists = expensesIndexes.find((index) => index.name === expensesIndexOpts.name);
if (!expensesIndexExists) await collections.expenses.createIndex({ upid: 1, _id: 1 }, expensesIndexOpts);

const settingsIndexes = await collections.settings.indexes();
const settingsIndexOpts = { unique: true, background: true, name: 'UNIQUE_UID_AND_MODULE_INDEX' };
const settingsIndexExists = settingsIndexes.find((index) => index.name === settingsIndexOpts.name);
if (!settingsIndexExists) await collections.settings.createIndex({ uid: 1, module: 1 }, settingsIndexOpts);

const metadataIndexes = await collections.metadata.indexes();
const metadataIndexOpts = { unique: true, background: true, name: 'UNIQUE_UPID_AND_MODULE_INDEX' };
const metadataIndexExists = metadataIndexes.find((index) => index.name === metadataIndexOpts.name);
if (!metadataIndexExists) await collections.metadata.createIndex({ upid: 1, module: 1 }, metadataIndexOpts);

process.on('SIGINT', () => mongoClient.close().then(() => logger.info('disconnected from database')));
global.getCollection = (name) => (collections[name] || db.collection(name)) as any;

/********************************************* Inits *********************************************/

const { initLibrary } = await import('@/lib');

const Library = await initLibrary();

/********************************************* Hooks *********************************************/

const { Context, AUTH, Utils } = await import('@/utils');

async function verifyCookie(cookie?: string) {
  if (!cookie) throw error(401, { message: 'Unauthorized' });
  const { sid, uid } = Utils.decodeCookie(cookie);
  const user = await Library.user.findByID(uid);
  if (!user) throw error(401, { message: 'Unauthorized' });
  const session = user.sessions.find((s) => s.id === sid);
  if (!session) throw error(401, { message: 'Unauthorized' });
  Context.setCurrentSession(session);
  return user;
}

async function getUserSettings(uid: string, headers: Request['headers']) {
  const settings = await Library.settings.findByUID(uid);
  let profile = settings?.profile[0] ?? null;
  const profileHeader = headers.get('X-Chronicle-Profile');
  if (profileHeader) {
    const pid = /^(IN|GB)$/.test(profileHeader) ? profileHeader : 'IN';
    profile = settings?.profile.find((p) => p.id === pid) ?? null;
  }
  return { settings, profile };
}

export const handle: Handle = async ({ event, resolve }) => {
  return Context.init(event, async () => {
    logger.info('Request context inited');

    const url = event.url.pathname;
    if (url === '/api/status' || url === '/api/set-cookie') return resolve(event);

    const user = await verifyCookie(event.cookies.get(AUTH.COOKIE_NAME));
    const { profile, settings } = await getUserSettings(user.uid, event.request.headers);
    Context.setCurrentUser(user, settings, profile);

    return resolve(event);
  });
};
