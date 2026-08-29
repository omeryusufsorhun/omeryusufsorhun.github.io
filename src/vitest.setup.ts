import '@testing-library/jest-dom/vitest'

// Node 25 ships an experimental global `localStorage` that is an inert stub
// unless the runtime is started with --localstorage-file. Vitest's jsdom
// environment copies that stub over jsdom's own Storage, leaving a bare object
// with no getItem/setItem/clear. Install a real in-memory Storage so the app
// code under test talks to something that behaves like the browser's.
function createStorage(): Storage {
  let entries = new Map<string, string>()
  return {
    get length() {
      return entries.size
    },
    key(index: number) {
      return [...entries.keys()][index] ?? null
    },
    getItem(key: string) {
      return entries.has(key) ? entries.get(key)! : null
    },
    setItem(key: string, value: string) {
      entries.set(key, String(value))
    },
    removeItem(key: string) {
      entries.delete(key)
    },
    clear() {
      entries = new Map()
    },
  } as Storage
}

const storage = createStorage()
for (const target of [globalThis, window]) {
  Object.defineProperty(target, 'localStorage', {
    configurable: true,
    writable: true,
    value: storage,
  })
}
