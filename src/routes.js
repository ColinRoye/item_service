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
          let ret = await service.addItem(args.content, args.childType, args.parent, args.media, username);
	  ret.status = ret.status.status
          res.send(ret);
     }else{
          res.send({status:"error", "error":"Not Authorized"})
     }
});
router.get('/item/:id', async (req, res, next)=>{
     let args = req.params;
     let ret = await service.getItemById(args.id);

     ret.status = ret.status.status
     if(!ret.item){ret.status = env.statusError.status}
     debug.log(ret)
     res.send(ret);
});
router.delete('/item/:id', async (req, res, next)=>{
     if(service.authorize(req.cookies["auth"])){
          let args = req.params;
          let ret = await service.deleteItemById(args.id, req.cookies["auth"]);
          ret.status = ret.status.status
          if(ret.status == 'error'){
               res.status(400).send(ret)
          }else{
               debug.log(ret)
               res.send(ret);
          }

     }else{
          res.status(400).send("error")

     }

});

router.post('/search', async (req, res, next)=>{
     let args = req.body;
     console.log(JSON.stringify(args));
     let ret = await service.search(args.timestamp, args.limit, args.username, args.following, req.cookies["auth"], args.q, args.rank);
     //debug.log(ret)
     debug.log("ret in routes " + ret);
     ret = {status: env.statusOk.status, items:ret}
     res.send(ret);
});
router.get('/auth', async(req,res,next)=>{
     res.send("test: " + req.cookies["auth"]);
});

router.get('/items/:username/:limit', async(req,res,next)=>{
     let args = req.params;
     console.log(JSON.stringify(args));
     let ret = await service.searchByUsername(args.username, args.limit);
     debug.log(ret)
     ret = {status: env.statusOk.status, items:ret}
     res.send(ret);
});

router.get('/yesornoSSH', async(req,res,next)=>{
     res.send({status:"OK", msg:"Bro wtf did you do to my project"});
});


router.post('/item/:id/like', async(req,res,next)=>{
     if(service.authorize(req.cookies["auth"])){
          let args = req.params;
          let body = req.body;
          let ret = await service.likeItem(args.id, body.like, req.cookies["auth"]);
          debug.log("Return of like item " + ret)
          ret = {status: env.statusOk.status, msg:"Item liked/unliked!" };
          res.send(ret);
     }
});
//router.post('/items', async(req,res,next)={
//     console.log("frix");
//     res.send("test");
//});
module.exports = router
