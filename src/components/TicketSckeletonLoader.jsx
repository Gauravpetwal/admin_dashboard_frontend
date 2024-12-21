import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TicketSkeletonLoader = () =>{
    return(
        <>
        <SkeletonTheme baseColor="gray" highlightColor="#374151">
         <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-gray-800 shadow-lg rounded-lg p-6">
        {/* Header Section */}
        <div>
          <Skeleton width={100} height={35} />
        </div>

        <div className="flex justify-between items-center mb-4">
          <Skeleton width={200} height={25} />
          <Skeleton width={100} height={20} />
        </div>

        {/* User Info */}
        <div className="text-sm text-white mb-4">
          <Skeleton width={100} height={20} />
          <Skeleton width={200} height={20} />
        </div>

        {/* Ticket Message */}
        <div className="bg-gray-600 p-3 rounded-lg mb-6">
          <Skeleton width="100%" height={50} />
        </div>

        {/* Ticket Actions */}
        <div className="flex gap-4 items-center mb-6">
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
          <Skeleton width={120} height={40} />
        </div>

        {/* Date Information */}
        <div className="flex justify-between text-sm text-gray-500">
          <Skeleton width={150} height={20} />
          <Skeleton width={150} height={20} />
        </div>
      </div>
    </div>
    </SkeletonTheme>
        </>

    )
}
export default TicketSkeletonLoader