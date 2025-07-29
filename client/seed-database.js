// Database seeding script
import { seedDatabase, clearDatabase } from './src/lib/seedData.js'

console.log('🌱 ClassConnect Database Seeder')
console.log('================================')

// Check if user wants to clear database first
const args = process.argv.slice(2)
const shouldClear = args.includes('--clear') || args.includes('-c')

async function runSeeding() {
  try {
    if (shouldClear) {
      console.log('🧹 Clearing existing data...')
      const cleared = await clearDatabase()
      if (!cleared) {
        console.log('❌ Failed to clear database')
        return
      }
    }

    console.log('🌱 Starting database seeding...')
    const result = await seedDatabase()
    
    if (result) {
      console.log('\n✅ Seeding completed successfully!')
      console.log(`📊 Added to database:`)
      console.log(`   👥 Users: ${result.users}`)
      console.log(`   👨‍🏫 Teachers: ${result.teachers}`)
      console.log(`   📚 Classes: ${result.classes}`)
    } else {
      console.log('\n❌ Seeding failed')
    }
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

runSeeding() 