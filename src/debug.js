module.exports ={
     log: (str)=>{
          if(process.argv.includes("-d")){
               console.log("\nDEBUG: " + str + "\n")
          }
     }
}
