import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardSkeleton = () => {
  return (
    <>
      <SkeletonTheme baseColor="gray" highlightColor="#374151">
        <div className="flex items-center flex-col sm:flex-row justify-center bg-gray-700 sm:p-5 sm:m-4 p-3 m-3 rounded-lg gap-3 hover:cursor-pointer transition-transform transform hover:scale-110">
          <div className="flex justify-center items-center sm:marker:rounded-full sm:m-2 sm:p-2 max-w-11 px-2 py-2 rounded-3xl">
            <Skeleton circle width={50} height={50} />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="md:text-xl lg:text-xl font-semibold">
              <Skeleton width={100} height={20} />
            </h1>
            <p>
              <Skeleton width={50} height={20} />
            </p>
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
};

const CircleSkeleton = () => {
  return (
    <>
       <SkeletonTheme baseColor="gray" highlightColor="#374151">
      {/* First Card Skeleton */}
      <div className="bg-gray-800 p-5 sm:p-5 ml-3 mr-3 rounded-xl">
        <div className="flex items-center justify-center gap-3">
            <Skeleton width={50}/>
         <Skeleton width={50}/>
            <Skeleton width={50}/>
            </div>
        <div className="flex flex-col justify-center items-center">
          <Skeleton width={200} height={200} circle /> {/* Skeleton Circle for Pie Chart */}
        </div>
      </div>
  </SkeletonTheme>
    </>
  );
};

const ChartSkeleton = () =>{
    return(
        <>
             <SkeletonTheme baseColor="gray" highlightColor="#374151">
             <div className="bg-gray-800 mt-2 mb-2 sm:mt-5 sm:mb-5 flex items-center ml-3 mr-3 sm:mr-5 justify-center rounded-xl gap-5">
                <Skeleton width={50} height={200}/>
                <Skeleton  width={50} height={160}/>
                <Skeleton  width={50} height={400}/>
             
             </div>
 
             </SkeletonTheme>

        </>
    )
}

export  {DashboardSkeleton,CircleSkeleton,ChartSkeleton};
