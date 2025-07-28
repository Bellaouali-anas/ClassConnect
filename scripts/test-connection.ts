import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('📡 Attempting to connect...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('classes')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error)
      console.log('\n🔧 Troubleshooting tips:')
      console.log('1. Make sure Supabase is running: supabase start')
      console.log('2. Check your environment variables')
      console.log('3. Verify the database schema is applied: supabase db reset')
      console.log('4. Check if the URL and API key are correct')
    } else {
      console.log('✅ Connection successful!')
      console.log('📊 Database is accessible')
    }
  } catch (error) {
    console.error('❌ Connection error:', error)
    console.log('\n🔧 Common solutions:')
    console.log('1. Start Supabase: supabase start')
    console.log('2. Check if Docker is running')
    console.log('3. Verify port 54321 is not in use')
  }
}

testConnection() 