const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('connected server-side app')
})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})