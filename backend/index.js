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
    res.json(result).status(200)
  } catch (exception) {
    console.error('Error fetching courses:', exception)
    res.status(500).json({ error: 'Internal server error' })
  }
})