import Multiselect from 'multiselect-react-dropdown';
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { useUsers } from '../../context/userContext';
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { FaSleigh } from 'react-icons/fa';
import Loader from '../../components/Loader';
import {taskToUpade, editTask} from '../../api/task/edit';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const EditTask = ({ onClose, taskId, updatedValue, notify }) => {
  const [updatedTask, setUpdatedTask] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
 // const { users, fetchUsers, triggedrEvent, removeEvent } = useUsers();
  const [Loading, setLoading] = useState(false);
  const errorNotify = (message) => toast.error(message);
  const suuccessNotify = (message) => toast.success(message);
  const [existingData, setExistingData] = useState();
  const token = localStorage.getItem("Token");
  const [assignUsers, setAssignUsers] = useState([])
  const [users,setUsers] = useState([])
  const [assignedUserId, setAssignUserId] = useState([])
  const [restUsers, setResttUsers] = useState([])
  const [removedUserIds, setRemovedUsersIds] = useState([])
  const [currentDate, setCurrentDate] = useState()

  useEffect(() => {
    const getTask = async () => {
      setLoading(true)
      const { status, data } = await taskToUpade(taskId, token);
      if (!status) {
        setExistingData(null);
        return;
      }
       setValue("title", data.task.title);
      setValue("description", data.task.description);
      setValue("content", data.task.content);
      if(data.task.expirydate)
      {
        const expirydate = new Date(data.task.expirydate).toISOString().split('T')[0];
        setCurrentDate(expirydate)
        setValue('expirydate', expirydate)
      }

      setUsers(data.users)
    setExistingData(data.task);
     if(data.assignedUsers.length > 0 && Array.isArray(data.users) ){     
      const assignUserIds = data.assignedUsers.map(user => user.id); // Extract assigned user IDs
      const assignedusers = data.users.filter(user => assignUserIds.includes(user.id)); 
      const resttUsers = data.users.filter(user => !assignUserIds.includes(user.id));
      setAssignUsers(assignedusers)
      setResttUsers (resttUsers)  

     
     }
     else{
       setResttUsers(data.users)
     }
  setTimeout(()=>{

    setLoading(false)
  },2000)    

    };
    getTask();
  }, []);
  const {register,handleSubmit,formState: { errors },setValue,reset} = useForm();

  //function edit task
  const handleEditTask = async ({ title, description, content, expirydate }) => {
    setLoading(true)
    const { status, data, message } = await editTask({
      token, taskId, title, description, content, expirydate,assignedUserId, removedUserIds});
    if (!status) {
        setTimeout(()=>{
            setLoading(false)    
            errorNotify(message);
        },1000)
        return
    }
    setExistingData(data);
   await  updatedValue(data);
    setTimeout(()=>{
      setLoading(false)
      notify("Task updated")
      onClose()
       // return suuccessNotify(message);
    },1000)
  };



  //for add user in task
  const handleSelect = (selectedList) => {
    const selectedUserIds = selectedList.map((user) => user.id);
    setAssignUserId(selectedUserIds)
   
}

//remove user from the task
const handleRemove = (selectedList) =>{
  const selectedUserIds = selectedList.map((user) => user.id);
  setAssignUserId(selectedUserIds)
}

//close the form
const handlCloseForm = () =>{
  reset()
  onClose()
}

 

  //main view section
  return (
    <>
       <SkeletonTheme baseColor="gray" highlightColor="#374151">
      <div>
        <div className={`flex justify-center mb-4`}>
          <div
            className={`fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50 `}
          >        
            <div className={` w-full bg-gray-800 p-8 rounded-lg shadow-lg max-w-5xl  overflow-y-auto max-h-[100vh] transition-all duration-300`}
            >
              <form
                onSubmit={handleSubmit(handleEditTask)}
                className="space-y-6"
              >
                <h1 className="flex justify-center text-white font-extrabold font-sans underline text-2xl items-center">
                  Edit task
                </h1>

                {/* Task Title input */}
                <div className="mb-4 text-white">
                  <label
                    htmlFor="title"
                    className="block text-white font-serif font-semibold"
                  >
                    Task Title
                  </label>
              {Loading ? <Skeleton height={40}/> : <input
                    type="text"
                    id="title"
                    className={`w-full p-3 mt-2 border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600`}
                    {...register("title", {
                      required: "Title is required",
                      maxLength: {
                        value: 100,
                        message: "Title can't be more than 100 characters",
                      },
                    })}
                  />}
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Task Description input */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-white font-serif font-semibold"
                  >
                    Task Description
                  </label>
                 {Loading ? <Skeleton height={100}/> : <textarea
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
                  />}
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Last Date input */}
                <div className="mb-4">
                  <label
                    htmlFor="expirydate"
                    className="block text-white font-serif font-semibold"
                  >
                    Expiry Date
                    
                  </label>
                 {Loading ? <Skeleton height={40}/> : <input
                    type="date"
                    id="expirydate"
                    className={`w-full p-3 mt-2 border text-white ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600`}
                    {...register("expirydate")}
                  />}
                  {errors.expirydate && (
                    <p className="text-red-500 text-sm">
                      {errors.expirydate.message}
                    </p>
                  )}
                </div>

                {/* Task Content input */}
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-white font-serif font-semibold"
                  >
                    Task Content
                  </label>
                 {Loading ? <Skeleton height={100}/> : <textarea
                    id="content"
                    rows="4"
                    className={`w-full p-3 mt-2 border text-white ${
                      errors.content ? "border-red-500" : "border-gray-300"
                    } 
                       rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600`}
                    {...register("content", {
                      required: "Main Content is required",
                    })}
                  />}
                  {errors.content && (
                    <p className="text-red-500 text-sm">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Select User to Remove from Task */}
              <div className="mb-4">
         <label htmlFor="assignUser" className="block text-white font-semibold">
         Remove or Add  user
         </label>
        {Loading ?<Skeleton height={40}/> : <Multiselect
           className="text-white bg-gray-700"
           displayValue="userName"
           onKeyPressFn={function noRefCheck() {}}
           onSearch={function noRefCheck() {}}
           onRemove={handleRemove}
           onSelect={handleSelect}

           options={users}
           selectedValues={assignUsers}        
           
           style={{
             searchBox: {
               backgroundColor: '#4B5563',
               borderColor: '#444',
               borderRadius: '.375rem',
             },
             optionContainer: {
               backgroundColor: '#4B5563',
               borderColor: '#444',
             },
             option: {
               backgroundColor: '#4B5563',
               color: 'white',
             },
             optionSelected: {
               backgroundColor: '#4A5568', // Dark Gray background when selected
               color: '#fff',
             },
           }}
         />}
       </div>

                {/* Submit and Close Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={handlCloseForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </SkeletonTheme>
    </>
  );
};

export default EditTask;