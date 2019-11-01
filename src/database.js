const env = require("./env");
const debug = require("./debug");
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://elasticsearch:9200' })

const index = "tests20";
const type = "test20";

//define database specific tasks here
module.exports={
     getItemById: async (id)=>{
          let status = env.statusOk;
          let error;
          let item;
          const response = await client.search({
               index: index,
               type: type,
               body: {
                 query: {
                   match: {
                     _id: id
                   }
                 }
               }

          }).catch((e)=>{
               debug.log(e);
               status = env.statusError;
               error = "error";
          })
          if(response && response.body && response.body.hits.hits[0]){
               item = response.body.hits.hits[0]._source;
               debug.log("item: " + JSON.stringify(item));
          }
	  if(item){
	       item.id = id 
	  }
          let result = {
               status: status,
               item: item,
               error: error
          }

          debug.log(JSON.stringify(result));
          return result;
     },

     search: async (timestamp, limit)=>{
          let status = env.statusOk;
          let error;
          let item;
          if(!limit){
               limit = 25;
          }
          if(limit > 100){
               debug.lot("to large");
               limit = 100;
          }
          debug.log("timestamp" + timestamp)
          const response = await client.search({
               index: index,
               type: type,
               size : limit,
               body:{
                    query: {
                       range : {
                           timestamp : {
                               
			       lte : timestamp
                           }
                       }
                   }
               }
         }).catch((e)=>{
              debug.log(e);
              status = env.statusError;
              error = "error";
         })
          debug.log(JSON.stringify(response))
	  if(response){
              return response.body.hits.hits.map((elm)=>{
      	          //if(elm.timestamp === timestamp){ return  }
		  let ret = elm._source;
     	          ret.id = elm._id;
	          return ret;
	      })
          return {}
	  }
     },
     addItem: async (item)=>{
          let status = env.statusOk;
          let error;
          let id;
          const response = await client.index({
               index: index,
               type: type,
               body: {
                    content: item.content,
                    childType: item.childType,
                    username: item.username,
                    timestamp: item.timestamp,
                    retweets: 0,
                    property: { likes: 0 }
                 }
          }).catch((e)=>{
               debug.log(e);
               status = env.statusError;
               error = "error";
          })
          if(response.body){
               id = response.body._id
               debug.log(id);
          }
          let result = {
               status: status,
               id: id,
               error: error
          }
          debug.log(JSON.stringify(response));
          return result;
     },
     getAll: async ()=>{
	const response = await client.search({
               index: index,
               type: type,
         }).catch((e)=>{
              debug.log(e);
              status = env.statusError;
              error = "error";
         })
          debug.log(JSON.stringify(response))
          if(response){
              return response.body.hits.hits.map((elm)=>{
                  if(elm.timestamp === timestamp){ return  }
                  let ret = elm._source;
                  ret.id = elm._id;
                  return ret;
              })
          return {}
          }

     }
}
