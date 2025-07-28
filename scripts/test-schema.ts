import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSchema() {
  console.log('🔍 Testing database schema...')
  
  try {
    // Test each table
    const tables = ['users', 'classes', 'students', 'grades', 'attendance', 'assignments']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': Accessible`)
        }
      } catch (error) {
        console.log(`❌ Table '${table}': Not found or not accessible`)
      }
    }
    
    console.log('\n🎉 Schema test completed!')
    
  } catch (error) {
    console.error('❌ Error testing schema:', error)
  }
}

testSchema() 