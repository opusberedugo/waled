const { MongoClient } = require('mongodb');

// Database configuration
const DB_URL = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const DB_NAME = 'walED'; // Update with your database name
const COLLECTION_NAME = 'courses';
const RESET_VALUE = 5;

async function resetCourseSpaces() {
  let client;
  
  try {
    console.log('🔄 Connecting to database...');
    
    // Connect to MongoDB
    client = new MongoClient(DB_URL);
    await client.connect();
    
    console.log('✅ Connected successfully to database');
    
    // Get database and collection
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    
    // Check how many courses exist
    const totalCourses = await collection.countDocuments();
    console.log(`📚 Found ${totalCourses} courses in the database`);
    
    if (totalCourses === 0) {
      console.log('⚠️  No courses found. Nothing to reset.');
      return;
    }
    
    // Get current state before reset
    const coursesBefore = await collection.find({}, { projection: { name: 1, availableSpaces: 1 } }).toArray();
    console.log('\n📊 Current course spaces:');
    coursesBefore.forEach(course => {
      console.log(`   - ${course.name}: ${course.availableSpaces || 'undefined'} spaces`);
    });
    
    // Perform the reset
    console.log(`\n🔄 Resetting all course availableSpaces to ${RESET_VALUE}...`);
    
    const result = await collection.updateMany(
      {}, // Empty filter matches all documents
      { $set: { availableSpaces: RESET_VALUE } }
    );
    
    console.log(`\n✅ Reset completed successfully!`);
    console.log(`   - Matched: ${result.matchedCount} courses`);
    console.log(`   - Modified: ${result.modifiedCount} courses`);
    
    // Verify the reset worked
    const coursesAfter = await collection.find({}, { projection: { name: 1, availableSpaces: 1 } }).toArray();
    console.log('\n📊 Courses after reset:');
    coursesAfter.forEach(course => {
      console.log(`   - ${course.name}: ${course.availableSpaces} spaces`);
    });
    
    // Summary
    const allReset = coursesAfter.every(course => course.availableSpaces === RESET_VALUE);
    console.log(`\n${allReset ? '🎉 All courses successfully reset!' : '❌ Some courses may not have been reset properly'}`);
    
  } catch (error) {
    console.error('❌ Error during reset operation:', error.message);
    throw error;
  } finally {
    // Always close the connection
    if (client) {
      await client.close();
      console.log('🔐 Database connection closed.');
    }
  }
}

// Function to reset with custom value
async function resetCourseSpacesCustom(customValue = 5) {
  let client;
  
  try {
    console.log(`🔄 Resetting all course spaces to ${customValue}...`);
    
    client = new MongoClient(DB_URL);
    await client.connect();
    
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    
    const result = await collection.updateMany(
      {},
      { $set: { availableSpaces: customValue } }
    );
    
    console.log(`✅ Reset completed: ${result.modifiedCount} courses updated to ${customValue} spaces`);
    
  } catch (error) {
    console.error('❌ Error during custom reset:', error.message);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔐 Database connection closed.');
    }
  }
}

// Function to reset only specific courses
async function resetSpecificCourses(courseNames, resetValue = 5) {
  let client;
  
  try {
    console.log(`🔄 Resetting specific courses to ${resetValue} spaces...`);
    console.log(`🎯 Target courses: ${courseNames.join(', ')}`);
    
    client = new MongoClient(DB_URL);
    await client.connect();
    
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    
    const result = await collection.updateMany(
      { name: { $in: courseNames } },
      { $set: { availableSpaces: resetValue } }
    );
    
    console.log(`✅ Reset completed: ${result.modifiedCount} courses updated`);
    
    if (result.modifiedCount !== courseNames.length) {
      console.log(`⚠️  Note: ${courseNames.length - result.modifiedCount} courses may not have been found`);
    }
    
  } catch (error) {
    console.error('❌ Error during specific reset:', error.message);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔐 Database connection closed.');
    }
  }
}

// Run the script if called directly
if (require.main === module) {
  console.log('🚀 Starting course spaces reset script...\n');
  
  resetCourseSpaces()
    .then(() => {
      console.log('\n🎉 Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error.message);
      process.exit(1);
    });
}

// Export functions for use in other modules
module.exports = {
  resetCourseSpaces,
  resetCourseSpacesCustom,
  resetSpecificCourses
};