import axios from "axios";
import { SquareMenu } from "lucide-react";
import { Bell } from "lucide-react";
import { useEffect } from "react";
const Header = ({ clicked }) => {
  return (
    <>
      <div className="bg-gray-800 p-4 rounded-1xl">
        <nav>
          <ul className="flex justify-between items-center sm:items-start sm:text-center">
            <li className="ml-3 sm:ml-0">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-3xl font-extrabold font-serif transform transition duration-300 ease-in-out hover:scale-110 hover:text-opacity-80">
                Task
                <span className="text-green-400">Manager</span>
              </h1>
            </li>
            <div className="flex items-center mr-5 gap-5">
              <li className="flex hover:cursor-pointer transition-transform hover:scale-110">
                <Bell width={30} height={30} />
                <sup className="text-blue-700 font-extrabold mt-2  shadow-green-500">
                  
                </sup>
              </li>
              <li>
                <button onClick={clicked} className={`sm:hidden  `}>
                  <SquareMenu width={30} height={30} className="text-white" />
                </button>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </>
  );
};
export default Header;
