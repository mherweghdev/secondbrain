import type { Config } from 'jest'

const config: Config = {
  displayName: 'integration',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../$1',
  },
  testTimeout: 30000,
}

export default config
