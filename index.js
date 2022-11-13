const express = require('express')
const { MongoClient } = require("mongodb");
const app = express()
const port = 3000

app.get('/movies', async (req, res) => {
  console.log("req.query", req.query);
  const year = Number(req.query.year);
  try {
    const result = await client.db('sample_mflix').collection('movies').find({year: year}).limit(10).toArray()
    // console.log(result)
    res.send(result)
    } catch (e) {
        console.error("DB HANDLER Error > getStatus()", e);
        throw (e)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://sdiricco:8vYaVvlDn2WjOl8K@cluster0.7ooa4te.mongodb.net/?retryWrites=true&w=majority";

  

const client = new MongoClient(uri);

const main = async () => {
    await client.connect();
    console.log('connesso al db')

}

main();
