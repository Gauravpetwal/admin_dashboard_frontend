import { set, useForm } from "react-hook-form";
import Multiselect from "multiselect-react-dropdown";
import { ToastContainer,toast } from "react-toastify";
import { useEffect, useState} from "react";
import { useUsers } from "../../context/userContext";
import addTask from "../../api/task/add";
import Loader from "../../components/Loader";
import axios from "axios";


const AddTask = ({ close,addedTask, notify}) => {
    const {fetchUsers} = useUsers()
  const { register, handleSubmit,formState: { errors }, setValue,} = useForm();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsrs] = useState([])
  const token = localStorage.getItem("Token")
  const errorNotify = (message) => toast.error(message);
  const suuccessNotify = (message) => toast.success(message);
  const [loading, setLoading] = useState(false)

const handleSelect = (selectedList) => {
    const selectedUserIds = selectedList.map((user) => user.id);
    setSelectedUsers(selectedUserIds);
};
const handleRemove = (selectedList) => {
  const selectedUserIds = selectedList.map((user) => user.id);
  setSelectedUsers(selectedUserIds);
};

//gettin all users
  const userslist = async () =>{ 
      const user =   await fetchUsers()
      setUsrs(user)
    } 

  //submitting   addtaskfrom
  const handleAddTask = async ({title,content,description,expirydate}) => {
      setLoading(true)
      const userIds = selectedUsers
      const {status, data, message} = await addTask({title,content,description,expirydate,token,userIds})
      if(status === 0){
        setTimeout(()=>{          
            setLoading(false)
            errorNotify(message)
            return 
        },1000)
      }

      await addedTask(data)       
        setTimeout(() => {
          notify("Task added")
          close()
        setLoading(false)
    // suuccessNotify("Taks added")
    }, 1000); 
    return 
     
  };  

  //fetching all user so task can be assing to the user
  const getAllUsrs = async() =>{
        const {data} = await axios('http://localhost:5000/api/allusers',{headers:{Authorization:`bearer ${token}`}})
        setUsrs(data.data)
  }
        
        

  useEffect(()=>{
    getAllUsrs()
       
  },[])
  return (
    <>
      <div>
        {/* <ToastContainer /> */}
        <div className="flex  mb-4">
          <div className="fixed flex justify-center items-center  inset-0 bg-gray-900 bg-opacity-90 z-50" >
        {loading && (<Loader/>)}
            <div className=" bg-gray-800 p-8 rounded-lg shadow-lg max-w-5xl w-full overflow-y-auto max-h-[100vh]">
              <form
                onSubmit={handleSubmit(handleAddTask)}
                className="space-y-6 text-black "
              >
             
                <div className="mb-2  gap-4 ">
              {/* Task Title input */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-white font-semibold font-serif text-sm"
                  >
                    Task Title:
                  </label>
                  <input
                    type="text"
                    id="title"
                    className={`w-full p-3 mt-2 border text-white ${
                      errors.title ? "border-red-500" : "border-gray-900"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600`}
                    {...register("title", {
                      required: "Title is required",
                      maxLength: {
                        value: 100,
                        message: "Title can't be more than 100 characters",
                      },
                    })}
                  />
                  {errors.title && (
                    <p className="text-blue-900 text-sm">
                      {errors.title.message}
                    </p>
                  )}

                </div>   

                {/* date section */}
                <div className="mb-4">
                  <label
                    htmlFor="expirydate"
                    className="block text-white mt-3 font-semibold font-serif"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expirydate"
                    className={`w-full p-3 mt-2 border text-white ${
                      errors.expirydate ? "border-red-500" : "border-gray-300"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 text-whire`}
                    {...register("expirydate", {
                      required: "Date is required",
                    })}
                  />
                  {errors.expirydate && (
                    <p className="text-orange-900 text-sm">
                      {errors.expirydate.message}
                    </p>
                  )}
                </div>
                </div>

                {/* Task Description input */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-white font-semibold font-serif"
                  >
                    Task Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className={`w-full p-3 mt-2 border text-white ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600`}
                    {...register("description", {
                      required: "Description is required",
                      maxLength: {
                        value: 500,
                        message:
                          "Description can't be more than 500 characters",
                      },
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-900 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>



                {/* Task Content input */}
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-white font-semibold font-serif"
                  >
                    Task Content
                  </label>
                  <textarea
                    id="content"
                     rows="4"
                    className={`w-full p-3 mt-2 text-start border h-20 overflow-y-auto ${
                      errors.content ? "border-red-500" : "border-gray-800"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 text-white`}
                    {...register("content", {
                      required: "Main Content is required",
                    })}
                  ></textarea>
                  {errors.content && (
                    <p className="text-orange-900 text-sm">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Select User to Assign Task */}
                <div className="mb-4">
                  <label
                    htmlFor="assignUser"
                    className="block text-white font-semibold font-serif" 
                  >
                    Select user to assign task
                  </label>
                  <Multiselect
                    className="text-white  focus:ring-green-500 "
                    displayValue="userName"
                    onKeyPressFn={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onRemove={handleRemove}
                    onSelect={handleSelect}
                    options={users}
                   
                    style={{
                      searchBox: {
                        backgroundColor:"#4B5563",
                        borderColor: "#444",
                        borderRadius: "0.375rem",
                      },
                      optionContainer: {
                        backgroundColor: "white",
                        borderColor: "#444",
                      },
                      option: {
                        backgroundColor: "black",
                        color: "white",
                      },
                      optionSelected: {
                        backgroundColor: "#4A5568", // Dark Gray background when selected
                        color: "black",
                      },
                    }}
               
                  />
                </div>

                {/* Submit and Close Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={close}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-800 transition duration-300"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTask;
