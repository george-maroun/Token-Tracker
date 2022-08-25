import express from 'express';
//const Article = require('./../models/article')
const router = express.Router()


// router.get('/', async (req, res) => {
//   // res.send(req.params.symbol);
//   res.render('projects/index');
// })

router.get('/:symbol', async (req, res) => {
  // res.send(req.params.symbol);
  res.render('projects/charts', {sym : req.params.symbol});
})



export default router;