const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;
// require("dotenv").config()

const typeDefs = gql`
  type Query {
  
    BookmarkApp: [BookmarkType]
  
  }
  type Mutation{
    add_Bookmark(name:String,url:String):BookmarkType,
    delete_Todo(id:String):String
  }


  type BookmarkType {
    id: ID
    name: String
    url:String
 
  }
`

const resolvers = {
  Query: {
 
    BookmarkApp: async(root,args,context) =>{
      try {
        var adminClient = new faunadb.Client({ secret:"fnAD91Lzk8ACBXO-_eDJjvPeLy81F3-befC7CtoI" });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('url'))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data,"data aya k nahi")
        console.log(result.data.ts,"yeh dekh aya k nahi")

        return result.data.map(d=>{
          return ({
            id: d.ref.id,
            name: d.data.name,
            url: d.data.url
          })
        })
      }catch(error){console.log(error,"error>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")}
    }
   ,
  },
  Mutation:{
    add_Bookmark:async(_,{name,url})=>{
      try{
        var adminClient = new faunadb.Client({ secret:"fnAD91Lzk8ACBXO-_eDJjvPeLy81F3-befC7CtoI" });

        var addQuery=await adminClient.query(
          q.Create(
            q.Collection('Bookmarks'),
            { data: { name:name,url:url} },
          )
        )
        console.log(addQuery.ref.data,"add wala function hai yeh")
        return(addQuery.ref.data)


      }catch(error){console.log(error,"error>>>>>>>>>>>>>>>")}
    },
    delete_Todo:async(_,{id})=>{
      console.log(id,"id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      try{
        var adminClient = new faunadb.Client({secret:"fnAD91Lzk8ACBXO-_eDJjvPeLy81F3-befC7CtoI"});
        console.log(id,"id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
       var Delete_Data=await adminClient.query(
        q.Delete(
          q.Ref(q.Collection('Bookmarks'),id)
        )

       )
       console.log(Delete_Data,"delete_data")
       return(Delete_Data.ref.id.toString())


      }catch(error){console.log(error,"error on delete bookamrk function")}
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
