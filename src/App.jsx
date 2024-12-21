import "./index.css";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Admin from "./pages/AdminDashbord";
import AdminSignin from "./pages/AdminSignin";
import { UserProvider } from "./context/userContext.jsx";
import User from "./pages/UserPages/User.jsx";
import Error from "./pages/Error.jsx";
import { ToastContainer, toast } from "react-toastify";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Task from "./pages/taks/Task.jsx";
import Support from "./pages/support/Support.jsx";
import Ticket from "./pages/support/Ticket.jsx";
import SupportChat from "./pages/support/Chat.jsx";
import Signup from "./pages/Signup";
function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<AdminSignin />} />            
            <Route path="/signup" element={<Signup />} />            
            <Route element={<Admin />}>
              <Route index element={<Dashboard/>}/>
              <Route path="/home" element={<Dashboard/>}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path="/User" element={<User />}/>     
              <Route path="/tasks" element={<Task/>}/>             
              <Route path="/support" element={<Support/>}/>             
              <Route path="/support/Ticket" element={<Ticket/>}/>             
              <Route path="/support/chat" element={<SupportChat/>}/>             
            </Route>
            <Route path="/error" element={<Error />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
