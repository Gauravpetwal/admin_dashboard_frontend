import React, { createContext, useState, useEffect, useContext } from 'react';
const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('Token');  // Fetch token from localStorage
  const [triggedrEvent, setTriggedrEvent] = useState(false)
  const [logedIn, setLogedIn] = useState(false)
  const [itemState, setItemState] = useState("Dashboard")
 
  //function to change itme state
  const changeItemState = (currentItem) =>{
    setItemState(currentItem)
  }



  //admin login state
  const login = () =>{
    localStorage.setItem("isLogedIn", true)
    setLogedIn(true)  
  }
  const logout = () =>{
    setLogedIn(false)
    console.log(logedIn)
  }

  //open EdtiTask
  const triggerEvent = () =>{
    setTriggedrEvent(true)
   }
   const removeEvent = () =>{
    setTriggedrEvent(false)
    
   }



  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(data.message); 
      } else {

        setUsers(data.data);  
        return data.data
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  useEffect(() => {
    if (token) {
    //  fetchUsers(); 
    }
  }, [token]);

  return (
    <UserContext.Provider value={{changeItemState,itemState, users, fetchUsers,triggerEvent,removeEvent,triggedrEvent, logedIn,logout,login}}>
      {children}
    </UserContext.Provider>
  );
};


export const useUsers = () => {
  return useContext(UserContext);
};
