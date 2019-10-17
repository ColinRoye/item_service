const express = require("express");
const app = express();
const router = require("express").Router();
const debug = require("./debug");
const env = require("./env");
const auth = require("./auth");
const service = require("./services");


router.post('/additem', async (req, res, next)=>{
     if(service.authorize(req.cookies["auth"])){
          let args = req.body;
          let username = req.cookies["auth"];
          let ret = await service.addItem(args.content, args.childType, username);
          res.send(ret);
     }else{
          res.send({"status":env.statusError, "error":"Not Authorized"})
     }
});
router.get('/item/:id', async (req, res, next)=>{
     let args = req.params;
     let ret = await service.getItemById(args.id);
     debug.log(ret)
     res.send(ret);
});
router.get('/search', async (req, res, next)=>{
     let args = req.body;
     let ret = await service.search(args.timestamp, args.limit);
     debug.log(ret)
     res.send(ret);
});
router.get('/auth', async(req,res,next)=>{
     res.send("test: " + req.cookies["auth"]);
})
module.exports = router
