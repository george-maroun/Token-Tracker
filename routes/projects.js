import express from 'express';
//const Article = require('./../models/article')
const router = express.Router()

// router.get('/chart', async (req, res) => {
//   // res.send(req.params.symbol);
//   res.redirect('chart.html');
// })
// router.get('/', async (req, res) => {
//   // res.send(req.params.symbol);
//   res.render('./index.html');
// })

router.get('/:symbol', async (req, res) => {
  // res.send(req.params.symbol);
  res.render('projects/charts');
})



export default router;