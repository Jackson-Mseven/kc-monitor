import { TransportRequest } from '@kc-monitor/core'

const DB_NAME = 'kc-monitor-events'
const STORE_NAME = 'events'

export async function saveEvent(event: TransportRequest) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  tx.objectStore(STORE_NAME).add({ ...event, time: Date.now() })
  await tx.done
}

export async function getAllEvents(): Promise<TransportRequest[]> {
  const db = await openDB()
  return db.getAll(STORE_NAME)
}

export async function removeEvent(url: string, body: string) {
  const db = await openDB()
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME)
  const all = await store.getAll()
  for (const item of all) {
    if (item.url === url && item.body === body) {
      await store.delete(item.id)
    }
  }
}

async function openDB() {
  const { openDB } = await import('idb')
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}
