const addTask = async  ({title,description,content,expirydate,userIds, token}) =>{
    try{
            const response = await fetch ("http://localhost:5000/api/addtask",{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`},
            body:JSON.stringify({title,description,content,expirydate,userIds})
        })
        const {message,data} = await response.json()
        if(response.status ===  403) return window.location.href= '/signin'
        if(data.status === 403) return console.log(data.status);
        if(!response.ok) return {status:0, message:message};
        return {status:1, message:message, data:data}

    }catch(error){
        return {statu:0, message:"Failed to add task"}
    }
}

export default addTask

