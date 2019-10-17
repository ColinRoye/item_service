const debug = require("./debug");
const env = require("./env");
const db = require("./database");
const uuid = require("uuid/v1")

//export db agnostic services
module.exports={
     addItem: async (content, childType, username)=>{
          let id = uuid();
          let item = {
               content: content,
               childType: childType,
               username: username,
               timestamp: Math.floor(new Date() / 1000),
               id: id
          }

          let ret = await db.addItem(item);
          return ret;
     },
     getItemById: async (id)=>{

          let ret = await db.getItemById(id);
          debug.log("RETURNING ITEM: " + ret);
          return ret;
     },
     search: async (timestamp, limit)=>{
          return db.search(timestamp, limit)
     },
     authorize: (cookie)=>{
          return (cookie !== "" && cookie);
     }

}
