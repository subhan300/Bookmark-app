import React from "react"
import gql from "graphql-tag"
import {useMutation,useQuery} from "@apollo/client"

const Bookmark_data=gql`
{
  BookmarkApp{
    id,
    name,
    url
  }

}

`
const ADD_Bookmark_data= gql`
    mutation add_Bookmark($name: String,$url:String){
        add_Bookmark(name: $name,url:$url){
            name,
            url
        }
    }
`
const DELETE_DATA=gql`
mutation delete_Todo($id:String){
   delete_Todo(id:$id)
}
`
export default function Home() {
  const [add_Bookmark]=useMutation(ADD_Bookmark_data)
  const [delete_Todo]=useMutation(DELETE_DATA)
  const{loading,error,data}=useQuery(Bookmark_data)
  if (loading)
  return <h2>Loading..</h2>

if (error) {
  console.log(error)
  return <h2>Error</h2>
}
  console.log(data,"data")

  let inputName;
  let inputUrl;
  const onSubmit=()=>{
   
    const Obj={
      name:inputName.value,
      url:inputUrl.value
    }
    add_Bookmark({
      variables:Obj,refetchQueries:[{query:Bookmark_data}]
    })
    console.log(Obj,"OBJ")
    inputName.value=""
    inputUrl.value=""

  }

  const DELETE_FUNC=async(p_id)=>{
    console.log(p_id,"id");

    await delete_Todo({
      variables:{
        id:p_id
      },
      refetchQueries:[{ query: Bookmark_data }]

    })

  }


  return (

<>

<div  style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
<div>

<h1>BOOKMARK APP </h1>
<div>
<label htmlFor="i">
 
  name :  &nbsp;
</label>

<input id="i" ref={node=>inputName=node}></input></div>


<div style={{marginTop:"10px"}}>
<label htmlFor="i">
 
 Link :  &nbsp;
</label>

<input id="i" ref={node=>inputUrl=node}></input>

<button onClick={onSubmit}>ADD BOOKMARK </button>

</div>

{/* data retrieve */}
<h1>BOOKMARK TITLE AND URL</h1>
  <div>{data.BookmarkApp.map(d=>{return(<div>
    <div>NAME : {d.name}<span> <div>url : {d.url}</div></span></div>
 
  <span><div><button onClick={()=>DELETE_FUNC(d.id)}>Delete Bookmark</button></div></span> 
  
   </div>)})}</div>
</div>


</div>







</>












  )
}
