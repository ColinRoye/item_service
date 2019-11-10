const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")

//export db agnostic services
module.exports={
     getAll: async()=>{
	   return await db.getAll();
     },
     addItem: async (content, childType, parent, media, username)=>{
       let id = uuid();
	  let ret = {};

	  if(!content){
	       ret.status = env.statusError
	       return ret
	  }
          let item = {
               content: content,
               childType: childType,
               username: username,
               parent: parent,
               media: media,
               timestamp: (new Date() / 1000),
               id: id
          }

          ret = await db.addItem(item);
          return ret;
     },
     getItemById: async (id)=>{

          let ret = await db.getItemById(id);
          debug.log("RETURNING ITEM: " + ret);
          return ret;
     },
     getItemById: async (id)=>{

          let ret = await db.getItemById(id);
          debug.log("GETTING ITEM: " + ret);
          return ret;
     },
     deleteItemById: async (id, username)=>{
          let item = await db.getItemById(id);
          let ret = {};
          debug.log("DELETE_SERVICE: ITEM "+ JSON.stringify(item))
          if(item.item && item.item.username === username){
               ret = await db.deleteItemById(id);
               debug.log("DELETEING ITEM: " + ret);

               return ret;
          }else{
               debug.log("USER DOES NOT OWN POST")
               return {status: {status: "error"}}
          }

     },
     search: async (timestamp, limit, username, following, currentUser, queryString)=>{
          if(limit === "undefined"){
               limit = undefined;
          }
          return db.search(timestamp, limit, username, following, currentUser, queryString)
     },
     authorize: (cookie)=>{
          return (cookie !== "" && cookie);
     },
     searchByUsername: (username, limit)=>{
          return db.searchByUsername(username, limit)
     }


}
