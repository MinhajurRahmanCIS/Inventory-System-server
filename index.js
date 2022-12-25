const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ermhfxw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('foodie').collection('products');
        const cartCollection = client.db('foodie').collection('carts');

        //product add

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        //product APi
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/displayproduct', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.limit(3).toArray();
            res.send(products);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });


        // carts api
        app.get('/carts', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = cartCollection.find(query).sort( { "price": 1 } );
            const carts = await cursor.toArray();
            res.send(carts);
        });

        //cart add

        app.post('/carts', async (req, res) => {
            const cart = req.body;
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        });

        //cart delete
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cart = await cartCollection.findOne(query);
            res.send(cart);
        });

        app.put('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const cart = req.body;
            console.log(cart)
            const option = {upsert: true};
            const updatedcart = {
                $set: {
                    msg: cart.msg
                }
            }
            const result = await cartCollection.updateOne(filter, updatedcart, option);
            res.send(result);
        })
    }
    finally {

    }

}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('Inventory System Running');
})

app.listen(port, () => {
    console.log(`Port is running on ${port}`)
})