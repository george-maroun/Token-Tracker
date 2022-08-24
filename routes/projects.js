import express from 'express';
//const Article = require('./../models/article')
const router = express.Router()

import { fileURLToPath } from 'url';
import { dirname } from 'path';




router.get('/', async (req, res) => {
  // res.send(req.params.symbol);
  res.render('projects/index', {sym : req.params.symbol});
})

router.get('/:symbol', async (req, res) => {
  // res.send(req.params.symbol);
  res.render('projects/charts', {sym : req.params.symbol});
})



export default router;