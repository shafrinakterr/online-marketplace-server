const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// mongodb Aplication code

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5sfjjkj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // mongodb data collection
        const productCollection = client.db('jobCategoryData').collection('jobData')
        const jobPostCollection = client.db('jobCategoryData').collection('jobPost')
        const userApplyjobCollection = client.db('jobCategoryData').collection('user')

        // category Data

        app.get('/job', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // job post 
        app.post('/jobPost', async (req, res) => {
            const jobPost = req.body;
            const result = await jobPostCollection.insertOne(jobPost)
            res.send(result)
        })

        // get data 
        app.get('/jobPost', async (req, res) => {
            const category = req.query?.cate;
            const query = {};
            if (category) {
                query.category = category
            }
            const cursor = jobPostCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // udated code
        app.put('/jobPost/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedJobPost = req.body;
            const job = {
                $set:{
                    email: updatedJobPost.email, 
                    title: updatedJobPost.title, 
                    category: updatedJobPost.category,
                    deadline: updatedJobPost.deadline, 
                    maxprice: updatedJobPost.maxprice, 
                    minprice: updatedJobPost.minprice, 
                    description: updatedJobPost.description
                }
            }
            const result = await jobPostCollection.updateOne(filter, job , options);
            res.send(result)
        })
        // dalete
        app.delete('/jobPost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobPostCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/jobPost/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobPostCollection.findOne(query);
            res.send(result)
        })

        // user data post 

        app.post('/user', async (req, res) => {
            const userJob = req.body;
            const result = await userApplyjobCollection.insertOne(userJob)
            res.send(result)
            console.log(result)
        })

        app.get('/user', async (req, res) => {
            const cursor = userApplyjobCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        // my bids
        app.get('/my-bids/:email', async (req, res) => {
            const email = req.params?.email;
            const query = {
                email:email
            }
            console.log(query);
            const result = await userApplyjobCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/reqestJob/:email', async (req, res) => {
            const email = req.params?.email;
            const query = {
                buyerEmail:email
            }
            console.log(query);
            const result = await userApplyjobCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/jobStatus/:id', async(req,res)=>{
            const id = req.params.id;
            const status = req.query?.status;
            const query = {_id: new ObjectId(id)}
            const updateJob = {
                $set:{
                    jobStatus: status
                }
            }
            const result = await userApplyjobCollection.updateOne(query, updateJob);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is runnig ')
})
app.listen(port, () => {
    console.log(`server is running on por ${port}`)
})

// purnoakter11
// Q1zjdwGEZCYMDoSA