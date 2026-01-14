/**
 * Custom Jest matchers for project-specific assertions
 * Extend this file as needed for custom test matchers
 */

import { expect } from '@jest/globals'

// Extend Jest matchers interface using module augmentation
declare module '@jest/expect' {
  interface Matchers<R> {
    toHaveExactClasses(expectedClasses: string[]): R
  }
}

// Custom matcher to check if an element has exact CSS classes (no more, no less)
expect.extend({
  toHaveExactClasses(received: HTMLElement, expectedClasses: string[]) {
    const actualClasses = Array.from(received.classList).sort()
    const expectedSorted = [...expectedClasses].sort()

    const pass =
      actualClasses.length === expectedSorted.length &&
      actualClasses.every((cls, index) => cls === expectedSorted[index])

    if (pass) {
      return {
        message: () =>
          `expected element not to have exact classes ${expectedSorted.join(', ')}\n` +
          `but it has: ${actualClasses.join(', ')}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected element to have exact classes: ${expectedSorted.join(', ')}\n` +
          `but it has: ${actualClasses.join(', ')}`,
        pass: false,
      }
    }
  },
})

export {}
