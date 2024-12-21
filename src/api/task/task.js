const getTasks = async (pageNumber,limit,token,column, orderby) =>{
  try{
      const response = await fetch(`http://localhost:5000/api/task?page=${pageNumber}&pageSize=${limit}&orderby=${orderby}&column=${column}`,{
          method:'GET',
          headers: {   Authorization:`Bearer ${token}`}
      })
      const {message,data} = await response.json()
      if(response.status === 403){
        return {status:403}
      }
      if(!response.ok){
          return {status:0,}
      }
      if(response.ok){
        return {status:1,message:message, data:data}
      }
      
  }catch(error){
      return {status:0,message:"Failed to load"}
  }
}
export default getTasks