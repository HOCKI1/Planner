import { openDB } from 'idb';

const DB_NAME = 'PlannerDB';
const STORE_NAME = 'adminData';
const DATA_ID = 'adminSettings';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveAdminData(data) {
  const db = await initDB();
  await db.put(STORE_NAME, {
    id: DATA_ID,
    data,
    updatedAt: new Date().toISOString()
  });
}

export async function loadAdminData() {
  const db = await initDB();
  const result = await db.get(STORE_NAME, DATA_ID);
  return result?.data;
}

export async function resetAdminData() {
  const db = await initDB();
  await db.delete(STORE_NAME, DATA_ID);
}