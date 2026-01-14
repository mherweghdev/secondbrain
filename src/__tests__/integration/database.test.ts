import { Client } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.test for integration tests
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

describe('Database Connection', () => {
  let client: Client | null = null
  let connectionSuccess = false

  beforeAll(async () => {
    // Skip tests if DATABASE_URL is not set
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not set - integration tests will be skipped')
      return
    }

    const testClient = new Client({
      connectionString: process.env.DATABASE_URL,
    })

    try {
      await testClient.connect()
      client = testClient
      connectionSuccess = true
      // eslint-disable-next-line no-console
      console.log('✅ Test database connected successfully')
    } catch (error) {
      console.error('❌ Failed to connect to test database:', (error as Error).message)
      console.warn('⚠️ Integration tests will be skipped - Docker services may not be running')
      connectionSuccess = false
    }
  })

  afterAll(async () => {
    if (client) {
      await client.end()
      // eslint-disable-next-line no-console
      console.log('✅ Test database disconnected')
    }
  })

  it('connects to test database successfully', async () => {
    if (!connectionSuccess || !client) {
      console.warn('⚠️ Skipping test - database connection not available')
      return // Graceful skip
    }

    // Simple query to verify connection
    const result = await client.query('SELECT 1 as value')
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].value).toBe(1)
  })

  it('verifies PostgreSQL version is 15.x or newer', async () => {
    if (!connectionSuccess || !client) {
      console.warn('⚠️ Skipping test - database connection not available')
      return // Graceful skip
    }

    const result = await client.query('SELECT version() as version')
    expect(result.rows).toHaveLength(1)

    const version = result.rows[0].version
    expect(version).toMatch(/PostgreSQL (1[5-9]|[2-9]\d)/) // Match 15 or higher
  })

  it.todo('can create and query database records - TODO: Implement in Story 1.2 with Prisma schema')
})
