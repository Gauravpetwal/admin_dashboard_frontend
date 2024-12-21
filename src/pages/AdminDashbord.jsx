import { useState, useEffect, } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { ToastContainer, toast } from "react-toastify";




//main function
const Admin = () => {
  const navigate = useNavigate()
  const [isSideBarOpen, setSideBar] = useState(false)  
  const token = localStorage.getItem("Token")  
  useEffect(()=>{
    if(!token) return navigate('/signin')
  })

  //open sidebar
  const hanldeOpenSideBar = () =>{
    setSideBar(!isSideBarOpen)
  } 

  if(!token)return navigate('/signin')


  return (
    <>      
<div className="bg-gray-900 min-h-screen w-full overflow-hidden">
  <div className="w-full text-white ">
    
    {/* Header */}
    <header>
      <Header clicked={hanldeOpenSideBar} />
    </header>
    

    <div className="w-full sm:flex ">
      {/* Sidebar */}
      <aside className={`bg-gray-800 shadow-5xl rounded-lg p-5  sm:w-56   sm:block lg:block md:block 2xl:block ${isSideBarOpen ? 'block' :'hidden'}`}>
      <SideBar closeNavBar={hanldeOpenSideBar} />
      </aside>
      
      {/* Main Content Area */}
      <div className="w-full min-h-screen">
        <Outlet />
      </div>
    </div>
  </div>

  {/* Footer */}
  <footer className="rounded-lg shadow dark:bg-gray-800">
    <Footer />
  </footer>
</div>

</>

  );
};

export default Admin;
