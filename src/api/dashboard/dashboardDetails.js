const dashboardDeatails = async (token) =>{
    try{
     const response = await fetch ('http://localhost:5000/api/dashboardDetails',{
       method:'GET',
         credentials: 'include',
       headers:{
        Authorization:`bearer ${token}`
       }
    })
    const {data} = await response.json()
    if(response.status === 403 ){
        return {status:403}
    }
 
    if(!response.ok){
        return {status:0}
    }

        return {status:1, data:data}
    
    }catch(error){
        return {status:0, message:"failed to load the count"}
    }
}

export default dashboardDeatails