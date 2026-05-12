const DB_NAME = 'scribably-history'
const DB_VERSION = 2
const STORE_NAME = 'entries'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function getAll(): Promise<import('./history').HistoryEntry[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result as import('./history').HistoryEntry[])
    req.onerror = () => reject(req.error)
  })
}

async function put(entry: import('./history').HistoryEntry): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function batchPut(entries: import('./history').HistoryEntry[]): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    for (const entry of entries) {
      store.put(entry)
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function del(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function clear(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function count(): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function migrateFromLocalStorage(): Promise<number> {
  try {
    const raw = localStorage.getItem('scribably-history')
    if (!raw) return 0
    const parsed: unknown[] = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return 0
    const entries = parsed.map(item => ({
      ...item,
      timestamp: typeof (item as { timestamp: number }).timestamp === 'number'
        ? (item as { timestamp: number }).timestamp
        : Date.now(),
    })) as import('./history').HistoryEntry[]
    await batchPut(entries)
    localStorage.removeItem('scribably-history')
    return entries.length
  } catch {
    return 0
  }
}

export { getAll, put, del, clear, count, openDB }
export type { HistoryEntry } from './history'
