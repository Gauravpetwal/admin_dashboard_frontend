import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Support() {
    const [loading ,setLoading] = useState(false)
    const navigate = useNavigate()
    const [issues, setIssues] = useState([])
    const token = localStorage.getItem("Token")
    const successNotify = (message) => {return toast.success(message)};
      const errorsNotify = (message) => {return toast.error(message)};
      const [currentPage, setCurrentPage] = useState(0);
      const [pageCount, setPageCount] = useState(0);
      const limit = 10

      //function to handle nuw page click
      const handlePageClick = async (event) => {
        const selectedPage = event.selected + 1;
        setCurrentPage(selectedPage);
        await getIssue(selectedPage);
      };

    const getIssue = async (selectedPage) => {
        try {
          setLoading(true)
          const url =`http://localhost:5000/api/allticket?page=${selectedPage}&pageSize=${10}`;
          const { data } = await axios.get(url, {
            headers: { Authorization: `bearer ${token}` },
          })    
          if (data.statusCode === 0) return errorsNotify(data.message);
          setPageCount(Math.ceil(data.data.count / limit)); 
          setIssues(data.data.rows);
          setTimeout(() =>{
            setLoading(false)

          },1000)
        } catch (error) {
          setLoading(false)
          return errorsNotify(error.message);
        }
      };

      const handleIssue = (ticketid) =>{
        try{
            navigate('/support/Ticket',{state:{ticketid}})

        }catch(error){
            return errorsNotify(error.message)
        }

      }

    
    useEffect(() => {

        getIssue();
      }, []);

  return (
    <>
        <ToastContainer/>
        <SkeletonTheme baseColor="gray" highlightColor="#374151">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900  mb-4">Reported Issues</h2>
      
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-700 text-left text-white border-b border-gray-500 ">
              <th className="px-6 py-3 text-sm font-medium  text-white">Username</th>
              <th className="px-6 py-3 text-sm font-medium text-white">User Email</th>
              <th className="px-6 py-3 text-sm font-medium text-white">User ID</th>
              <th className="px-6 py-3 text-sm font-medium text-white">Issue</th>
              <th className="px-6 py-3 text-sm font-medium text-white">Status</th>
              <th className="px-6 py-3 text-sm font-medium text-white">Message</th>
              <th className="px-6 py-3 text-sm font-medium text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr  onClick={() => handleIssue(issue.id)} key={issue.id} className="hover:bg-gray-900 hover:cursor-pointer border-b border-gray-600">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{loading? <Skeleton/> :issue.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loading? <Skeleton/> : issue.useremail}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loading? <Skeleton/> : issue.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loading? <Skeleton/> :issue.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loading? <Skeleton/> : issue.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loading? <Skeleton/> : issue.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{loading? <Skeleton/> : new Date(issue.createdAt).toLocaleDateString()}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">View</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1 bg-gray-700 flex justify-center p-2 rounded">
            <ReactPaginate
              className="flex items-center space-x-2 text-sm text-bold"
              previousLabel={
                <span className="text-white font-black cursor-pointer hover:text-green-500">
                  {" "}
                {loading? <Skeleton/> :  <p>Previous</p>}
                </span>
              }
              nextLabel={
                <span className="text-white font-black cursor-pointer   hover:text-green-500">
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
              pageClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-green-700 transition-colors"
              previousClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-900 transition-colors"
              nextClassName="px-3 py-1 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-900 transition-colors"
              disabledClassName="text-gray-300 cursor-not-allowed"
            />
          </div>
    </div>
    </SkeletonTheme>
  </>
  );
}


export default Support