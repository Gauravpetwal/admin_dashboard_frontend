import { set, useForm } from "react-hook-form";
import addUser from "../../api/users/add";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import {userToUpdate,editUser} from "../../api/users/edit";
import { LockKeyhole,CircleUserRound,Mail, PenIcon, BanIcon,BadgeCheck} from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";





//main function
const Edit = ({close,userId, updatedValue,notify}) =>{
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const token = localStorage.getItem("Token")
  const errorNotify = (message) => toast.error(message);
  const suuccessNotify = (message) => toast.success(message);
  const [loading,setLoading] = useState(false)
  const [existingData, setExistingData] = useState([]);
  const [userStatus, setUserStatus] = useState()

useEffect (()=>{
  setLoading(true)
  const getUser = async () => {
        const { status, data } = await userToUpdate(userId, token);
        if (!status) {
          setExistingData(null);
          return;
        }
        setValue("name", data.userName);
        setValue("email", data.email);
        setValue ("accountStatus",data.accountStatus)
        setUserStatus(data.accountStatus)
        setExistingData(data);
        setTimeout(()=>{setLoading(false)},2000)
      };
      getUser();

},[])



  //function edit task
  const handleEditUser = async ({ name, email, password,accountStatus }) => {
    if (
      existingData.userName === name &&
      existingData.email === email &&
      existingData.accountStatus === accountStatus &&
      !password
     ) {
        
      return errorNotify("make changes first");
    }
    // setLoading(true)
    const { status, data, message } = await editUser({
      token, userId, name, email, password, accountStatus});
    if (!status) {
        setTimeout(()=>{
            setLoading(false)    
            errorNotify(message);
        },1000)
        return
    }
    setExistingData(data);
   await updatedValue(data);
    setTimeout(()=>{
      notify("Updated")
      close()
      // setLoading(false)
       // return suuccessNotify("Updated");
    },1000)
  };
   
    return(
        <>  
        <SkeletonTheme baseColor="gray" highlightColor="#374151">

        <div className="flex justify-center items-center">                      
              {/* <ToastContainer/> */}
            <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
              <div className="bg-gray-800 p-8 rounded-lg shadow-5xl max-w-md w-full text-white ">
                <div className="flex justify-center gap-2 mb-6">
                  <PenIcon />
                <h2 className="text-2xl font-bold ">
               Edit User Deatails
                </h2>
                  </div>
                <form onSubmit={handleSubmit(handleEditUser)}>
                  {/* Username input */}
                  <div className="mb-4">
               <label
                      htmlFor="username"
                      className="flex gap-2  text-white font-semibold font-serif"
                    >
                 
                    <CircleUserRound/>
                      Name
                    </label>

                  {loading ? <Skeleton height={40}/> :  <input                    
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
                    />}
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
                      className="flex gap-2  text-white font-extrabold font-serif"
                    >
                      <Mail/>
                      Email
                    </label>
                  {loading? <Skeleton height={40}/> :  <input
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
                    />}
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
                      className="flex gap-2  text-balck font-semibold font-serif"
                    >
                      <LockKeyhole/>
                      Password
                    </label>
                   {loading? <Skeleton height={40}/> :  <input
                      type="password"
                      id="password"
                      className={`w-full p-3 mt-2 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700`}
                      {...register("password", {
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      })}
                    />}
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                            <label
                              htmlFor="role"
                              className="flex gap-2 tex-black font-semibold font-serif"
                            >
                              {(userStatus) === "blocked" ?  <BanIcon/> : <BadgeCheck/>}
                          
                              Account Status
                            </label>
                            {loading? <Skeleton height={40}/> : <select
                              id="role"
                              className={`w-full p-3 mt-2 border ${
                                errors.role
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700`}
                              {...register("accountStatus"
                                )}
                            >
                              <option value={existingData.accountStatus}>{existingData.accountStatus}</option>
                              <option value={existingData.accountStatus==='blocked' ? 'unblocked' : 'blocked'}>{existingData.accountStatus==='blocked' ? 'unblock' : 'block'}</option>
                            </select>}
                            {/* {errors.role && (
                              <p className="text-red-500 text-sm">
                                {errors.role.message}
                              </p>
                            )} */}
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
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    >
                     Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          
        </div>
       </SkeletonTheme>

        </>
    )
}
export default Edit