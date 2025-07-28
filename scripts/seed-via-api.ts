// Using global fetch (available in Node.js 18+)

async function seedViaAPI() {
  console.log('🌱 Seeding database via API endpoint...')
  
  try {
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Database seeded successfully!')
      console.log('📊 Summary:', result.summary)
    } else {
      console.error('❌ Failed to seed database:', result.error)
    }
  } catch (error) {
    console.error('❌ Error calling seeding endpoint:', error)
    console.log('\n💡 Make sure your server is running: npm run dev')
  }
}

seedViaAPI() 