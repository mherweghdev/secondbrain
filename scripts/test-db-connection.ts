import { Client } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

async function testConnection() {
  console.log('Testing database connection...')
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment')
    return false
  }

  // Mask password in output
  console.log('DATABASE_URL:', databaseUrl.replace(/:[^:@]+@/, ':****@'))

  const client = new Client({
    connectionString: databaseUrl,
  })

  try {
    await client.connect()
    const result = await client.query('SELECT version() as version')
    console.log('✅ Database connection successful!')
    console.log('PostgreSQL version:', result.rows[0].version)
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('❌ Database connection failed:', message)
    return false
  } finally {
    await client.end()
  }
}

testConnection()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
