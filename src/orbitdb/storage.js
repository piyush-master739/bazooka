import IpfsClient from 'ipfs-http-client';
import OrbitDB from 'orbit-db';

const ipfs = IpfsClient('localhost', '5001')

// Initiatlize the OribitDB Instance
const orbitdb = await OrbitDB.createInstance(ipfs)
const db = await orbitdb.log('connected')

// A simple getter for the connected database
export const fetchDatabase = async () => {
  return await db;
}

export const insertEntry = async (data) => {
  // Add an entry to the l1 Database
  const hash = await db.add(JSON.stringify(data))
  return hash
}

// Fetch all the entries in the connected database
export const fetchAllEntries = async () => {
  const result = db.iterator({ limit: -1 }).collect()
  console.log(JSON.stringify(result, null, 2))
  return result;
}

