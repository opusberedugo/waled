const express = require('express')
const cors = require('cors')

const { MongoClient, ObjectId } = require('mongodb')

const app = express()// const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.listen(process.env.PORT||3000)

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})

const client = new MongoClient('mongodb://localhost:27017', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err)
    return
  }
  console.log('Connected to MongoDB')
})
const db = client.db('walED')



app.get('/api/get-courses',async (req, res) => {
  try {
    const collection = db.collection("courses")
    const result = await collection.find({}).toArray()
    res.status(200).json(result) // Fixed: status before json
  } catch (exception) {
    console.error('Error fetching courses:', exception)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const updateOrderSpaces = async (orderItems) => {
  try {
    const collection = db.collection("courses"); // Fixed: use 'courses' not 'collection2'
    
    // Validate input
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('Invalid order items: must be a non-empty array');
    }

    const updateResults = [];
    
    for (const item of orderItems) {
      try {
        // Extract properties from frontend order structure
        const { id, name, quantity } = item;
        
        // Validate required properties
        if (!name || !quantity) {
          console.error(`Invalid item: missing name or quantity`, item);
          updateResults.push({
            course: name || 'Unknown',
            success: false,
            error: 'Missing required fields'
          });
          continue;
        }

        // Find course by name (or by id if you prefer)
        const courseData = await collection.findOne({ name: name });
        
        if (!courseData) {
          console.error(`Course not found: ${name}`);
          updateResults.push({
            course: name,
            success: false,
            error: 'Course not found'
          });
          continue;
        }

        // Check if enough spaces are available
        if (courseData.availableSpaces < quantity) {
          console.warn(`Not enough space for ${name}. Available: ${courseData.availableSpaces}, Requested: ${quantity}`);
          updateResults.push({
            course: name,
            success: false,
            error: `Insufficient spaces. Available: ${courseData.availableSpaces}, Requested: ${quantity}`
          });
          continue;
        }

        // Update available spaces
        const result = await collection.updateOne(
          { name: name }, 
          { $inc: { availableSpaces: -quantity } }
        );

        if (result.modifiedCount > 0) {
          console.log(`Updated ${name}: Available spaces decremented by ${quantity}`);
          updateResults.push({
            course: name,
            success: true,
            spacesReduced: quantity,
            newAvailableSpaces: courseData.availableSpaces - quantity
          });
        } else {
          console.warn(`No spaces updated for ${name}`);
          updateResults.push({
            course: name,
            success: false,
            error: 'Update operation failed'
          });
        }

      } catch (itemError) {
        console.error(`Error processing item:`, item, itemError.message);
        updateResults.push({
          course: item.name || 'Unknown',
          success: false,
          error: itemError.message
        });
      }
    }

    // Return summary of results
    const successful = updateResults.filter(r => r.success).length;
    const failed = updateResults.filter(r => !r.success).length;
    
    console.log(`Update complete: ${successful} successful, ${failed} failed`);
    
    return {
      success: failed === 0,
      totalItems: orderItems.length,
      successful,
      failed,
      results: updateResults
    };

  } catch (error) {
    console.error(`Error updating order spaces: ${error.message}`);
    throw error; // Re-throw to allow caller to handle
  }
};

app.post('/api/add-order', async (req, res) =>{
  try {
    const collection = db.collection("orders")
    const result = await collection.insertOne(req.body)
    console.log("Order added successfully")
    await updateOrderSpaces(req.body.items) // Fixed: await the updateOrderSpaces call
    res.status(200).json(result) // Fixed: status before json
  } catch (exception) {
    console.error('Error adding order:', exception)
    res.status(500).json({ error: 'Internal server error' })
  }
})