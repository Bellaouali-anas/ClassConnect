import 'dotenv/config'

async function testNetwork() {
  console.log('🌐 Testing network connectivity...')
  
  try {
    // Test basic internet connectivity
    const response = await fetch('https://httpbin.org/get')
    if (response.ok) {
      console.log('✅ Internet connectivity: OK')
    } else {
      console.log('❌ Internet connectivity: Failed')
    }
  } catch (error) {
    console.log('❌ Internet connectivity: Failed', error)
  }

  // Test Supabase URL format
  const supabaseUrl = process.env.SUPABASE_URL
  console.log('🔗 Supabase URL:', supabaseUrl)
  
  if (supabaseUrl && !supabaseUrl.includes('your-project')) {
    try {
      // Test if the Supabase URL is reachable
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
        }
      })
      
      if (response.status === 401) {
        console.log('✅ Supabase URL is reachable (401 is expected for unauthorized access)')
      } else if (response.ok) {
        console.log('✅ Supabase URL is reachable')
      } else {
        console.log(`❌ Supabase URL returned status: ${response.status}`)
      }
    } catch (error) {
      console.log('❌ Supabase URL is not reachable:', error)
    }
  } else {
    console.log('⚠️  Supabase URL still has placeholder values')
  }
}

testNetwork() 