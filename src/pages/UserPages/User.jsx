//import getUsers from "../../api/users/getUser";
import { useState, useEffect } from "react";
import {
  UserPen,
  UserMinus,
  ChevronDown,
  ChevronUp,
  Search,
  CalendarRange,
} from "lucide-react";
import deleteUser from "../../api/users/delete";
import AddUser from "./AddUser";
import Loader from "../../components/Loader";
import { UserPlus } from "lucide-react";
import ReactPaginate from "react-paginate";
import user from "../../api/users/user";
import Edit from "./Edit";
import "react-toastify/dist/ReactToastify.css"; // Make sure this line is present
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { get } from "react-hook-form";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

//main function
const User = () => {
  const token = localStorage.getItem("Token");
  const errorNotify = (message) => toast.error(message);
  const suuccessNotify = (message) => toast.success(message);
  const [users, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addUserForm, setAddUserForm] = useState(false);
  const [editUserForm, setEditUserForm] = useState(false);
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  const [column, setColumn] = useState("createdAt");
  const [orderby, setOrderBy] = useState("DESC");
  const [inputValue, setInputValue] = useState("text");
  const [searchValue, setSearchValue] = useState();
  const [searchColumn, setSearchColumn] = useState("userName");

  //for pagination
  const limit = 10;
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Handle page click event
  const handlePageClick = async (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    await getUsers(selectedPage, column, orderby);
  };

  //getting task
  const getUsers = async (page, column, orderType) => {
    setLoading(true);
    try {
      const { status, message, data } = await user(
        page | 0,
        limit,
        token,
        column,
        orderType
      );
      if (status === 403) {
        return navigate("/Signin");
      }
      if (status === 0) {
        setTimeout(() => {
          setLoading(false);
          return errorNotify(message);
        }, 2000);
      }

      if (status === 1) {
        setPageCount(Math.ceil(data.count / limit));
        setUser(data.rows);
        setTimeout(() => setLoading(false), 1000);
      }
    } catch (error) {
      console.log(error);
      return errorNotify(error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("Token")) return navigate("/signin");
    getUsers(0, column, orderby);
  }, []);

  //deleting user
  const handleDeleteUser = async (id) => {
    setLoading(true);
    const { staus, message } = await deleteUser(id, token);
    if (staus === 0) {
      return errorNotify(message);
    }
    setUser(users.filter((user) => user.id !== id));
    setTimeout(() => {
      setLoading(false);
      suuccessNotify(message);
      return;
    }, 1000);
  };

  //updating user List after new user added
  const handleAddeduser = (addedUser) => {
    setUser([addedUser, ...users]);
  };

  //opening edit user form
  const handleOpenUser = (id) => {
    setUserId(id);
    setEditUserForm(true);
  };

  const handleUpdatedUser = (data) => {
    setUser(users.map((user) => (user.id === data.id ? data : user)));
  };
  const showSuccessToast = (message) => {
    suuccessNotify(message);
  };

  //changing order of data (AES, DESC)
  const changeOrderOfData = (columnName) => {
    orderby === "DESC" ? setOrderBy("ASC") : setOrderBy("DESC");
    setColumn(columnName);
    getUsers(currentPage, columnName, orderby);
  };

  //changing input type for the form
  const changeInputType = (e) => {
    setInputValue(e.target.value);
    setSearchColumn(e.target.value);
  };

  //get the search reasult
  const getSearchResult = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `http://localhost:5000/api/user/search?column=${searchColumn}&value=${searchValue}`
    );
    console.log(data);
    setUser(...data.data);
  };

  return (
    <>
       <SkeletonTheme baseColor="gray" highlightColor="#374151">
      <ToastContainer />
      <div className="w-full ">
        <div className="min-h-screen overflow-x-auto w-full p-4">
          {addUserForm && (
            <AddUser
              success={showSuccessToast}
              close={() => {
                setAddUserForm(false);
              }}
              addedUser={handleAddeduser}
            />
          )}
          {editUserForm && (
            <Edit
              notify={showSuccessToast}
              close={() => setEditUserForm(false)}
              userId={userId}
              updatedValue={handleUpdatedUser}
            />
          )}
          <div className=" sm:flex justify-between items-center w-full bg-gray-800  mb-3 rounded-lg p-1">
            <div className="gap-2 bg-gray-900 w-full sm:mt-3 sm:p-3 rounded-2xl mt-4 p-4">
              <form className="sm:flex w-full gap-2">
                <div className="flex p-1">

                <select
                  name=""
                  id="val"
                  onChange={(e) => changeInputType(e)}
                  className="text-white rounded-lg p-1 bg-gray-700 flex items-center"
                >
                  <option value="userName">Name</option>
                  <option value="email">Email</option>
                  <option value="accountStatus">Status</option>
                  <option value="createdAt">Created Date</option>
                </select>
                </div>
               
               <div className="flex sm:w-full">

                <input
                  type={inputValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="rounded-lg text-white w-full p-1 bg-gray-700 focus focus:ring-green-500"
                  />
                <button onClick={(e) => getSearchResult(e)}>
                  <Search />
                </button>
                  </div>
              </form>
            </div>

            <div className="flex items-center justify-center">

            <button
              onClick={() => setAddUserForm(true)}
              className="bg-blue-900 p-1 m-1 sm:p-3 sm:m-3 rounded"
              >
              <UserPlus />
            </button>
              </div>
          </div>



          {/*user table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 text-white text-sm rounded-lg">
              <thead>
                <tr className="text-left border-b border-gray-600 p-6">
                  <th className="px-2 py-3">
                    <div
                      onClick={() => changeOrderOfData("userName")}
                      className="flex items-center cursor-pointer"
                    >
                      {orderby === "DESC" && column === "userName" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                      User Name
                    </div>
                  </th>
                  <th className="px-6 py-3 ">
                    <div
                      onClick={() => changeOrderOfData("email")}
                      className="flex items-center cursor-pointer"
                    >
                      {orderby === "DESC" && column === "email" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-3 ">
                    <div
                      onClick={() => changeOrderOfData("accountStatus")}
                      className="flex items-center cursor-pointer"
                    >
                      {orderby === "DESC" && column === "accountStatus" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                      Account Status
                    </div>
                  </th>
                  <th className="px-6 py-3 ">
                    <div
                      onClick={() => changeOrderOfData("createdAt")}
                      className="flex items-center cursor-pointer"
                    >
                      {orderby === "DESC" && column === "createdAt" ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                      Created At
                    </div>
                  </th>
                  <th className="px-6 py-3 flex justify-center items-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b border-gray-600 ">
                    <td className="px-6 py-4">{loading? <Skeleton/> : user.userName}</td>
                    <td className="px-6 py-3 ">{loading? <Skeleton/> :user.email}</td>
                    <td className="px-6 py-3 ">{loading? <Skeleton/> : user.accountStatus}</td>
                    <td className="px-6 py-3  ">
                      {loading? <Skeleton/> : user.createdAt
                        ? new Date(user.createdAt).toISOString().split("T")[0]
                        : "Not set"}
                    </td>
                    <td className="flex justify-center items-center gap-3 px-5 py-3">
                     {loading ? <Skeleton  width={30} height={30}/> : <button
                        onClick={() => handleOpenUser(user.id)}
                        className="px-1 py-1 bg-green-600 text-white rounded-lg hover:bg-green-800 transition duration-300"
                      >
                        <UserPen />
                      </button>}

                   {loading ? <Skeleton width={30} height={30}/> :   <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-1 py-1 bg-red-600 text-white rounded-lg hover:bg-red-900 transition duration-300"
                      >
                        <UserMinus />
                      </button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/*pagination */}
          <div className="mt-2 bg-gray-700 flex justify-center p-2 rounded">
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
              pageCount={loading ? <Skeleton width={40} height={40}/> : pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="flex items-center space-x-2"
              activeClassName="bg-green-500 text-white px-3 py-1 rounded-full"
              pageClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-green-900 transition-colors"
              previousClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-900 transition-colors"
              nextClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-900 transition-colors"
              disabledClassName="text-gray-300 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      </SkeletonTheme>
    </>
  );
};

export default User;
