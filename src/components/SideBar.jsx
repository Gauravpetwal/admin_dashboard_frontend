import { useState, useEffect } from "react";
import { LayoutDashboard, LogOut, UserRound, History } from "lucide-react";
import { FaTasks } from "react-icons/fa";
import {useNavigate } from "react-router-dom";
import { useUsers } from "../context/userContext";
import { MessageCircleQuestion } from "lucide-react";
import  AdminLogout from "./Logout";

const SideBar = ({ closeNavBar }) => {
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false)
  const { changeItemState, itemState } = useUsers();
  const [activeItem, setActiveItem] = useState();
  // const handleItemClick = async (selectedItem) => {
  //   await changeItemState(selectedItem);
  //   setActiveItem(selectedItem);
  // };

  

  //function to naviage from one page to another
  const handleNavigate = (item, page) => {
    setActiveItem(item);
    navigate(`/${page}`);
    closeNavBar()
  };

  useEffect(() => {
    if (window.location.pathname === "/") return setActiveItem("Dashboard");
    if (window.location.pathname === "/User") return setActiveItem("Users");
    if (window.location.pathname === "/tasks") return setActiveItem("Tasks");
    if (window.location.pathname === "/Support")
      return setActiveItem("support");
  }, []);


  //closing the popup model
  const hanldleClose = () =>{
    setIsLogout(false)
  }



  //main viewing part
  return (
    <>
      <nav>
   {isLogout && (  < AdminLogout close={hanldleClose}/>)}
        <ul className="text-white font-bold font-serif text-1xl">
          <li
            onClick={() => handleNavigate("Dashboard", "")}
            className={`${
              activeItem === "Dashboard"
                ? "rounded-lg text-green-400"
                : "rounded-lg hover:bg-gray-700"
            } gap-8 items-center p-4  mb-2 flex hover:cursor-pointer`}
          >
            <LayoutDashboard className="text-2xl" />
            Dashboard
          </li>

          <li
            onClick={() => handleNavigate("Tasks", "tasks")}
            className={`${
              activeItem === "Tasks"
                ? "rounded-lg text-green-400"
                : "rounded-lg hover:bg-gray-700"
            }  gap-8 items-center p-4 mb-2 cursor-pointer flex`}
          >
            <FaTasks className="text-2xl" />
            Tasks
          </li>

          <li
            onClick={() => handleNavigate("Users", "User")}
            className={`${
              activeItem === "Users"
                ? "rounded-lg text-green-400"
                : "rounded-lg hover:bg-gray-700"
            } flex gap-8 items-center p-4 mb-2 cursor-pointer`}
          >
            <UserRound className="text-2xl " />
            Users
          </li>

          <li
            onClick={() => handleNavigate("support", "Support")}
            className={`${
              activeItem === "support"
                ? "rounded-lg text-green-300"
                : "rounded-lg hover:bg-gray-700"
            } flex gap-8 items-center p-4 mb-2  hover:cursor-pointer`}
          >
            <MessageCircleQuestion className="text-2xl" /> Support
          </li>

          <li
            onClick={(e) => {e.stopPropagation(); setIsLogout(true) } }
            className={`${
              activeItem === "Profile"
                ? "rounded-lg text-green-400"
                : "rounded-lg hover:bg-gray-700"
            } flex gap-8 items-center p-4 mb-2  hover:cursor-pointer`}
          >
            <LogOut className=" text-2xl" /> log out
          </li>
        </ul>
      </nav>

    </>
  );
};

export default SideBar;
