import { set, useForm } from "react-hook-form";
import addUser from "../../api/users/add";
import {  toast } from "react-toastify";
import { useState } from "react";
import Loader from "../../components/Loader";
import { LockKeyhole,CircleUserRound,Mail, NotebookPen} from "lucide-react";





//main function
const AddUser = ({close, addedUser, success}) =>{
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const token = localStorage.getItem("Token")
  const errorNotify = (message) => toast.error(message);
  const suuccessNotify = (message) => toast.success(message);
  const [loading,setLoading] = useState(false)

  //function for add user
  const handleAdduser = async ({name,email,password,})=>{
  setLoading(true)
  const {status,message,data} = await addUser(name,email,password,token)
  if(status === 0){
   setTimeout(()=>{
     setLoading(false)
     return errorNotify(message)
   },1000)
  } 
  if(status === 1 ){
      await addedUser(data)
    setTimeout(()=>{   
     success("User Added")
    close()
   setLoading(false)
    
  return   
  },1000)
}
  
  }
    return(
        <>       
            {/* <ToastContainer/> */}
        <div className="flex justify-center items-center">                      
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
              {loading && (<Loader/>)}
              <div className="bg-gray-800 p-8 rounded-lg shadow-5xl max-w-md w-full text-white">
                <div className="flex items-center justify-center mb-6 gap-2">
                <NotebookPen/>
                <h2 className="text-xl font-bold text-center underline">
               User Deatails
                </h2>
                </div>
                <form onSubmit={handleSubmit(handleAdduser)}>
                  {/* Username input */}
                  <div className="mb-4">
                    <label
                      htmlFor="username"
                      className="flex gap-2 text-white font-semibold font-serif"
                    >
                      <CircleUserRound/>
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className={`w-full p-3 mt-2 border ${
                        errors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700`}
                      {...register("name", {
                        required: "name is required",
                        maxLength: {
                          value: 50,
                          message:
                            "Username can't be more than 50 characters",
                        },
                      })}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Email input */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="flex gap-2 text-white font-extrabold font-serif"
                    >
                      <Mail/>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full p-3 mt-2 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password input */}
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="flex gap-2 text-balck font-semibold font-serif"
                    >
                     <LockKeyhole/>
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className={`w-full p-3 mt-2 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    {/* Close Button */}
                    <button
                      type="button" 
                      onClick={close}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                         Close

                    </button>

                    {/* Add User Button */}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 transition duration-300"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          
        </div>

        </>
    )
}
export default AddUser