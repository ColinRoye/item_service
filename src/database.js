const env = require("./env");
const debug = require("./debug");
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://130.245.170.216:9200' })

const index = "tests20";
const type = "test20";

//define database specific tasks here
module.exports={
     getItemById: async (id)=>{
          let status = env.statusOk;
          let error;
          let item;
          //post to image_service
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
     deleteItemById: async (id)=>{
          let status = env.statusOk;
          let error;
          let item;
          //post to image_service
          const response = await client.deleteByQuery({
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

          let result = {
               status: status,
               numDeleted: response.body.deleted,
               error: error
          }

          debug.log(JSON.stringify(result));
          return result;
     },
     search: async (timestamp, limit, username, following, currentUser)=>{
          let status = env.statusOk;
          let error;
          let item;
          debug.log("USERNAEM ASDFASDFADFS: "+ username)
          let queryBody =
          {
               query: {
                    bool:{
                         must:[
                               {
                                    simple_query_string : {
                                        query: "this is a test of the testExample",
                                        fields: ["content"]
                                   }
                              },
                              {
                                   range : {
                                        timestamp : {
                                             lte : timestamp
                                        }
                                   }
                              }]
                         }
               }
          }



          if(!limit){
               limit = 25;
          }
          if(limit > 100){
               debug.lot("to large");
               limit = 100;
          }
          if(!timestamp){
               timestamp = (new Date() / 1000)
          }
          if(username){
               queryBody.query.bool.must.push({
                    match: {
                        username : username
                   }
               })
          }
          //only shows
          if(following){
               let followingArr = axios.get(env.baseUrl+"/user/"+currentUser+"/following")//max issue?
               queryBody.query.bool.must.push({
                    match: {
                        username : followingArr
                   }
               })
          }
          debug.log("queryBody" + JSON.stringify(queryBody))
          let test = "testExample test"
          const response = await client.search({
               index: index,
               type: type,
               size : limit,
               body: queryBody



         }).catch((e)=>{
              debug.log(e);
              status = env.statusError;
              error = "error";
         })
          debug.log(JSON.stringify(response))
	  if(response){
            return response.body.hits.hits.map((elm)=>{
               let ret = elm._source;
     	     ret.id = elm._id;
	          return ret;
	      })
      }else{
           return {}
      }
     },

     searchByUsername: async (username, limit)=>{
          let status = env.statusOk;
          let error;
          let item;
          if(!limit){
               limit = 50;
          }
          if(limit > 200){
               debug.lot("to large");
               limit = 200;
          }
          debug.log("username" + username)
          const response = await client.search({
               index: index,
               type: type,
               size : limit,
               body:{
                    query: {
                         match: {
                           username: username
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
                ret = elm._id;
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
