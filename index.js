const express = require('express')
const app = express()
const port = process.env.PORT || 3600;

app.get('/', (req, res) => {
    res.send("secure travel server running")
});

app.listen(port, () => {
    console.log(`secure travel port number ${port}`)
})