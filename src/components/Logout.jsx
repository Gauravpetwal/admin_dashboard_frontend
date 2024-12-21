import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const AdminLogout = ({ close }) => {
    const [loading, setLoading] = useState(false)
    const popupRef = useRef(null);
    const navigate = useNavigate()

   //function to logout  
  const handleLogout = () => {
    setLoading(true)
    
    setTimeout(()=>{            
      localStorage.clear();
      setLoading(false)
      return navigate("/signin");
    },2000)
  };


  useEffect(()=>{
    const outSideClose = (e) =>{
      console.log(popupRef.current)
      if(!popupRef.current.contains(e.target)){
        close()
      }}
    document.addEventListener('click',outSideClose)
    return () => {document.removeEventListener('click',outSideClose)}
  },[])


  return (
    <>

<div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50">
  {loading&&(<Loader/>)}
  <div ref={popupRef} className="text-white rounded-xl bg-gray-800 p-6 max-w-sm w-full">
    <div className="flex justify-end">
      <X className="hover:cursor-pointer text-white hover:text-gray-400" onClick={close} />
    </div>

    <h3 className="text-center font-serif font-semibold text-xl mb-4">
      Are you sure you want to log out?
    </h3>

    <p className="text-center text-sm text-gray-300 mb-6">
      You may lose unsaved changes if you proceed.
    </p>

    <div className="flex justify-center gap-4">
      <button
        onClick={close}
        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md w-24"
      >
        Cancel
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md w-24"
      >
        Log Out
      </button>
    </div>
  </div>
</div>
    </>
  );
};

export default AdminLogout;
