import '@testing-library/jest-dom'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
  // @ts-expect-error - test env shim
  globalThis.ResizeObserver = ResizeObserverMock
}
