'use strict';

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection.js');

const router = express.Router();

const acl = require('../middleware/acl.js');
const bearer = require('../middleware/bearer.js')




const models = new Map();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next("Invalid Model");
    }
  }
});




router.get('/:model', bearer, acl('read'), handleGetAll);
router.get('/:model/:id', bearer, acl('read'), handleGetOne);
router.post('/:model', bearer, acl('create'), handleCreate);
router.put('/:model/:id', bearer, acl('update'), handleUpdate);
router.delete('/:model/:id', bearer, acl('delete'), handleDelete);

async function handleGetAll(req, res, next) {
  try{
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}catch(e){
  next(e.message)
}
}

async function handleGetOne(req, res, next) {
  try{
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}catch(e){
  next(e.message)}
}

async function handleCreate(req, res, next) {
  try{
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}catch(e){
  next(e.message)
}
}

async function handleUpdate(req, res, next) {
  try{
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}catch(e){
  next(e.message)
}
}

async function handleDelete(req, res, next) {
  try{
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}catch(e){
  next(e.message)
}
}


module.exports = router;
