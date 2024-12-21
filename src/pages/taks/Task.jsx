import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import getTasks from "../../api/task/task";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import {
  Pencil,
  Trash2,
  PlusCircleIcon,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import deleteTask from "../../api/task/delete";
import AddTask from "./Add";
import EditTask from "./Edit";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Task = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const errorNotify = (message) => toast.error(message);
  const suuccessNotify = (message) => toast.success(message);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const limit = 10;
  const [addTaskForm, setAddTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [selectedTaskId, setTaskId] = useState();
  const [column, setColumn] = useState("createdAt");
  const [orderby, setOrderBy] = useState("DESC");
  const [inputValue, setInputValue] = useState("text");
  const [searchValue, setSearchValue] = useState();
  const [searchColumn, setSearchColumn] = useState("title");
  const [searchReasult, setSearchReasult] = useState([]);

  // Handle page click event
  const handlePageClick = async (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    await paginatedtasks(selectedPage, column, orderby);
  };
  //getting task
  const paginatedtasks = async (page, column, orderby) => {
    setloading(true);
    try {
      const { status, message, data } = await getTasks(
        page | 0,
        limit,
        token,
        column,
        orderby
      );
      if (status === 403) {
        setloading(false);
        return navigate("/Signin");
      }
      if (status === 0) {
        setTimeout(() => {
          setloading(false);
          return errorNotify(message);
        }, 2000);
      }

      if (status === 1) {
        setPageCount(Math.ceil(data.count / limit));
        setTasks(data.rows);
        setTimeout(() => setloading(false), 1000);
      }
    } catch (error) {
      return errorNotify(error.message);
    }
  };

  //deleting task
  const handleDeleteTask = async (taskId) => {
    setloading(true);
    const { status, message } = await deleteTask(taskId, token);
    if (status === 0) {
      setloading(false);
      return errorNotify(message);
    }
    setTimeout(() => {
      setloading(false);
      setTasks(tasks.filter((task) => task.id !== taskId));
      return suuccessNotify("Task delete");
    }, 1000);
  };

  //opening add task form
  const openAddTaksForm = (taskId) => {
    setTaskId(taskId);
    setAddTaskForm(true);
  };

  //closing addtask form
  const closeAddTaskForm = () => {
    setAddTaskForm(false);
  };

  //updating task list
  const updateTaskList = (data) => {
    setTasks([data, ...tasks]);
  };

  //open edit task form
  const openEditTaskForm = (taskId) => {
    setEditTask(true);
    setTaskId(taskId);
  };
  //close edit task form
  const closeEditTaskForm = () => {
    setEditTask(false);
  };

  //updating the taklist after updation
  const handleUpdatedTask = (data) => {
    setTasks(tasks.map((task) => (task.id === data.id ? data : task)));
  };

  //useEffect hook
  useEffect(() => {
    paginatedtasks(0, column, orderby);
  }, []);

  //for notification
  const showSuccessToast2 = (message) => {
    suuccessNotify(message);
  };

  //changing the order of data
  const changeOrderOfData = (column) => {
    setColumn(column);
    orderby === "DESC" ? setOrderBy("ASC") : setOrderBy("DESC");
    paginatedtasks(currentPage, column, orderby);
  };

  // changing input type dynamicaaly
  const changeInputType = (e) => {
    setSearchColumn(e.target.value);
    if (e.target.value === "expirydate" || e.target.value === "createdAt") {
      setInputValue("date");
    } else {
      setInputValue("text");
    }
  };

  //getting search result
  const getSearchResult = async (e, column, value) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/searching?column=${searchColumn}&value=${searchValue}`
      );
      setSearchReasult(...data.data);
      setTasks(...data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div className="flex justify-center mb-4">
          {editTask && (
            <EditTask
              notify={showSuccessToast2}
              onClose={closeEditTaskForm}
              taskId={selectedTaskId}
              updatedValue={handleUpdatedTask}
            />
          )}
          {addTaskForm && (
            <AddTask
              notify={showSuccessToast2}
              close={closeAddTaskForm}
              toast={toast}
              addedTask={updateTaskList}
            />
          )}
        </div>

        <div className="min-h-screen  w-full  p-4">
          <div className="flex justify-between items-center bg-gray-700 mb-2 rounded-lg">
            {/* <h1 className="text-black font-bold ml-4 font-serif">Task list</h1> */}
            <div className="flex items-center gap-2 bg-gray-800 w-full m-3 p-3 rounded-lg">
              <form className="flex w-full gap-2 items-center">
                <select
                  name="search"
                  id="val"
                  onChange={(e) => changeInputType(e)}
                  className="text-white rounded-lg p-1 bg-gray-600"
                >
                  <option value="title">Title</option>
                  <option value="description">Description</option>
                  <option value="content">Content</option>
                  <option value="expirydate">Expiry Date</option>
                  <option value="createdAt">Created Date</option>
                </select>

                <input
                  type={inputValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="rounded-lg text-white w-full p-1 bg-gray-600"
                />
                <button onClick={(e) => getSearchResult(e)}>
                  <Search />
                </button>
              </form>
            </div>

            <button
              onClick={openAddTaksForm}
              className="bg-blue-900 p-3 m-3 rounded mr-4"
            >
              <PlusCircleIcon />
            </button>
          </div>

          {/*Table of usrs */}
          <SkeletonTheme baseColor="gray" highlightColor="#374151">
            <div className="overflow-x-auto">
              <table className="text-sm min-w-full table-auto bg-gray-800 text-white rounded-lg sm:ml:2 lg:ml:9">
                <thead>
                  <tr className="text-left border-b border-gray-600 gap-2">
                    <th
                      onClick={() => changeOrderOfData("title")}
                      className="px-6 py-3 hover: cursor-pointer"
                    >
                      <div className="flex items-center">
                        {orderby === "DESC" && column === "title" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                        Task Title
                      </div>
                    </th>

                    <th
                      onClick={() => changeOrderOfData("description")}
                      className="px-5 py-3 cursor-pointer"
                    >
                      <div className="flex items-center ">
                        {" "}
                        {orderby === "DESC" && column === "description" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                        <h1>Description</h1>
                      </div>
                    </th>

                    <th
                      onClick={() => changeOrderOfData("content")}
                      className="px-6 py-3  cursor-pointer"
                    >
                      <div className="flex items-center">
                        {orderby === "DESC" && column === "content" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                        Content
                      </div>{" "}
                    </th>

                    <th
                      onClick={() => changeOrderOfData("expirydate")}
                      className="px-6 py-3  cursor-pointer"
                    >
                      <div className="flex items-center">
                        {orderby === "DESC" && column === "expirydate" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                        <p>Expiry Date </p>
                      </div>{" "}
                    </th>

                    <th
                      onClick={() => changeOrderOfData("createdAt")}
                      className="px-6 py-3  cursor-pointer"
                    >
                      <div className="flex items-center">
                        {orderby === "DESC" && column === "createdAt" ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                        Created Date
                      </div>{" "}
                    </th>
                    <th className="px-6 py-3 flex justify-center items-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id} className="border-b border-gray-600">
                      <td className="px-5 py-4">
                        {loading ? <Skeleton /> : task.title}
                      </td>
                      <td className="px-5 py-4  sm:table-col">
                        {loading ? <Skeleton /> : task.description}
                      </td>

                      <td className="px-5 py-4  sm:table-col">
                        {loading ? <Skeleton /> : task.content}
                      </td>

                      <td className="px-5 py-4  sm:table-col">
                        {loading ? (
                          <Skeleton />
                        ) : task.expirydate ? (
                          new Date(task.expirydate).toISOString().split("T")[0]
                        ) : (
                          "Not set"
                        )}
                      </td>

                      <td className="px-5 py-4  sm:table-col">
                        {loading ? (
                          <Skeleton />
                        ) : task.createdAt ? (
                          new Date(task.createdAt).toISOString().split("T")[0]
                        ) : (
                          "Not set"
                        )}
                      </td>
                      <td className=" flex justify-center items-center gap-3 px-5 py-3 ">
                        {loading ? (
                         <Skeleton width={30} height={30} />
                        ) : (
                          <button
                            onClick={() => {
                              openEditTaskForm(task.id);
                            }}
                            className="px-1 py-1 bg-green-500 text-white rounded-lg hover:bg-green-900 transition duration-300"
                          >
                            <Pencil />
                          </button>
                            )}
                       
                       {loading ? (
                         <Skeleton  width={30} height={30}/>
                        ) : (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="px-1 py-1 bg-red-600 text-white rounded-lg hover:bg-red-800 transition duration-300"
                        >
                          <Trash2 />
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SkeletonTheme>

          <div className="mt-2 bg-gray-700 flex justify-center p-2 rounded-lg">
            <ReactPaginate
              className="flex items-center space-x-2 text-sm text-bold"
              previousLabel={
                <span className="text-white font-black cursor-pointer hover:text-green-500">
                  {" "}
                  <p>Previous</p>
                </span>
              }
              nextLabel={
                <span className="text-white font-black cursor-pointer hover:text-green-500">
                  Next
                </span>
              }
              breakLabel={<span className="text-gray-600">...</span>}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="flex items-center space-x-2"
              activeClassName="bg-green-500 text-white px-3 py-1 rounded-full"
              pageClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-green-800 transition-colors"
              previousClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-900 transition-colors"
              nextClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-900 transition-colors"
              disabledClassName="text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
