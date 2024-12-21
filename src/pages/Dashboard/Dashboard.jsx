import { Users, ListIcon } from "lucide-react";
import { useState, useEffect } from "react";
import dashboardDetails from "../../api/dashboard/dashboardDetails";
import { useNavigate } from "react-router-dom";
import { ColumnChart, PieChart } from "react-chartkick";
import "chartkick/chart.js";
import {
  DashboardSkeleton,
  CircleSkeleton,
  ChartSkeleton,
} from "../../components/DashBoardSkeleton";
import Skeleton from "react-loading-skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [totaluser, setTotalUser] = useState();
  const [totaltask, setTotalTask] = useState();
  const [totalSupport, setTotalSuport] = useState();
  const [supportPending, setPendingSuport] = useState();
  const [supportResolved, setResolvedSuport] = useState();
  const [onGoingIssues, setOnGoingIssue] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const { data, status } = await dashboardDetails(token);
      if (status === 403) {
        localStorage.clear();
        return navigate("/Signin");
      }
      setTotalTask(data.totalTaskCount);
      setTotalUser(data.totalUserCount);
      setTotalSuport(data.totalSupportCount);
      setPendingSuport(data.supportPendingCount);
      setResolvedSuport(data.supportResolvedCount);
      setOnGoingIssue(data.supportOngoingCount);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    fetchDetails();
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Total Users */}

          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div
              onClick={() => navigate("/User")}
              className="flex items-center flex-col sm:flex-row justify-center bg-[#9b9dff]  p-5 m-4 rounded-lg  gap-3  hover:cursor-pointer transition-transform  transform hover:scale-11"
            >
              <div className="flex justify-center items-center bg-white rounded-full  sm:m-2 sm:p-2 px-2 py-2 text-sm max-w-11">
                <Users className="text-sm sm:text-3xl text-black" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-sm md:text-xl lg:text-xl font-semibold">
                  Total Users
                </h1>
                <p>{totaluser}</p>
              </div>
            </div>
          )}
          {/* Total Tasks */}
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div
              onClick={() => navigate("/tasks")}
              className="flex items-center flex-col sm:flex-row justify-center bg-[#d1d57f] p-5 m-4 rounded-lg gap-3  hover:cursor-pointer  transition-transform  transform hover:scale-110"
            >
              <div className="flex justify-center items-center bg-white rounded-full sm:p-2 sm:m-2 px-2 py-2 max-w-11">
                <ListIcon className="text-3xl text-black" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-sm md:text-xl lg:text-xl font-semibold">
                  Total Tasks
                </h1>
                <p>{totaltask}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-auto justify-center gap-2 sm:gap-5 items-center">
          {loading ? (
            <CircleSkeleton />
          ) : (
            <div className="bg-gray-800 px-2 py-4 ml-3 mr-3 rounded-xl flex items-center justify-center">
              <PieChart
              width ={250}
               height={250}
                data={[
                  ["totaluser", totaluser],
                  ["totaltask", totaltask],
                  ["admin", 1],
                ]}
              />
            </div>
          )}

          {loading ? (
            <CircleSkeleton />
          ) : (
            <div className="bg-gray-800 px-2 py-4 ml-3 mr-3 rounded-xl flex items-center justify-center">
              <PieChart
                width ={270}
                height={270}
                data={[
                  ["Total Issues", totalSupport],
                  ["Pending Issues", supportPending],
                  ["Resolved Issues", supportResolved],
                  ["In Progress", onGoingIssues],
                ]}
              />
            </div>
          )}
        </div>

        {loading ? (
          <ChartSkeleton />
        ) : (
          <div className="bg-gray-800 mt-2 mb-2 sm:mt-5 sm:mb-5 flex items-center ml-3 mr-3 sm:mr-5 justify-center rounded-xl">
            <ColumnChart
              width="300px"
              height="500px"
              data={[
                ["Users", totaluser],
                ["Tasks", totaltask],
                ["Issues", totalSupport],
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
