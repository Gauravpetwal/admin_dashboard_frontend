const deleteTask = async(taskId,token) =>{
    try{
        const response = await fetch('http://localhost:5000/api/task/delete',{
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                Authorization :`Bearer ${token}`
            },
            body:JSON.stringify({taskId})
        })

        if(response.status === 403) return window.location.href= '/signin';

        if(!response.ok)return {status:0, message:"failed to delete"};
        

            return {status:1}


    }catch(error){
        return {status:0, message:"failed to delete"}
    }
}

export default deleteTask