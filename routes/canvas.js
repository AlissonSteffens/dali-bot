const express = require('express');

const dbController = require('../controllers/mongoController');
const Canvas = require('../models/Canvas');
const asyncHandler = require('../utils/utils');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await asyncHandler.handleAsyncMethod(dbController.getSchema, [Skill]);
  result !== 'error' ? res.send(result) : res.send({'error': 'An error has occurred'});
});
  
router.get('/:id', async (req, res) => {
  const result = await asyncHandler.handleAsyncMethod(dbController.getSchemaById, [Skill, req.params.id]);
  result !== 'error' ? res.send(result) : res.send({'error': 'An error has occurred'});
});
  
router.post('/', async (req, res) => {
  const result = await asyncHandler.handleAsyncMethod(dbController.createSchema, [Skill, req.body]);
  result !== 'error' ? res.send(result) : res.send({'error': 'An error has occurred'});
});
  
router.put('/:id', async (req, res) => {
  const result = await asyncHandler.handleAsyncMethod(dbController.updateSchema, [Skill, req.params.id, req.body]);
  result !== 'error' ? res.send(result) : res.send({'error': 'An error has occurred'});
});
  
router.delete('/:id', async (req, res) => {
  const result = await asyncHandler.handleAsyncMethod(dbController.deleteSchema, [Skill, req.params.id]);
  result !== 'error' ? res.send(result) : res.send({'error': 'An error has occurred'});
});

module.exports = router;