const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const port = process.env.PORT || 6500;

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
