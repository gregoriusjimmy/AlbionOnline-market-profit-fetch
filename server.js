const express = require('express');
const app = express();
app.listen(3000, () => console.log('listening..'));
app.use(express.static('public'));
app.use('/profit', express.static('public'));
app.use('/profit2', express.static('public'));