import { Collection, MongoClient } from "mongodb";
import { abc } from "../dotenv";
import { Event, Menu, User } from "~/types";

const uri = abc("DATABASE_URI");

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };

  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// DATABASE COLLECTIONS RETRIEVERS

async function getDatabase() {
  const promise = await clientPromise;
  const db = promise.db(abc("DATABASE_NAME"));
  return db;
}
async function getCollection<Type extends object>(name: string) {
  const _db = await getDatabase();
  const collection = _db.collection<Type>(name);
  return collection;
}
async function collections() {
  return {
    users: await getCollection<User>("users"),
    events: await getCollection<Event>("events"),
    menus: await getCollection<Menu>("menus"),
  } as const;
}
export async function db<Name extends "users" | "events" | "menus">(
  name: Name
) {
  const collection = await collections();
  const selected = collection[name] as Name extends "users"
    ? Collection<User>
    : Name extends "events"
    ? Collection<Event>
    : Collection<Menu>;

  return selected;
}
