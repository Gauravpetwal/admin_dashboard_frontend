import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import Loader from "../components/Loader";
// import { toast } from "react-toastify";


const AdminSignin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem("Token")
  const {register, handleSubmit,watch,formState: { errors },} = useForm();
  const notify = (message) => toast.error(message);

  //submiting the form
  const onSubmit = async (data) => {
    setLoading(true)
    const adminEmail = data.email;
    const adminPassword = data.password;

    const response = await fetch("http://localhost:5000/api/adminSignin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: adminEmail,
        userPassword: adminPassword,
      }),
    });
    const responseData = await response.json();
    if (responseData.statusCode===0) return notify(responseData.message);
    if (!response.ok) {
      setTimeout(() =>{
        setLoading(false)
        return notify(responseData.message);
      },2000)
      
    } else {
      const data = responseData.data;
      const token = data.token;
      localStorage.setItem("Token", token);
      setTimeout(()=>{
        setLoading(false)
        return  navigate("/");
      },2000)
    }
  };

  useEffect(()=>{
    if(token){ return navigate('/')
    }else{
  navigate('/signin')
  }
  },[])

  const handleLoginSuccess = (response) => {
     const idToken = response.credential; 
      axios.post('http://localhost:5000/api/google/signin',{idToken})
     .then((response)=>{ localStorage.setItem("Token",response.data.data.token)
      navigate('/')
     })
     .catch((err)=> notify(err.response.data.message))

  };

  const handleLoginFailure = (error) => {
    console.error('Google login error:', error);
  };


  return (
    <>
{/* {!token &&(      */}
  <section className="bg-black dark:bg-black min-h-screen">
  {loading &&(  <Loader/>)}
        <ToastContainer />
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-gray-800 rounded-lg shadow-xl  dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-3xl font-extrabold font-serif transform transition duration-300 ease-in-out hover:scale-110 hover:text-opacity-80 flex justify-center items-center">
    Task 
    <span className="text-green-400">Manager</span>
  </h1>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Sign in
              </h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    {...register("email", {
                      required: true,
                      message: "email rquired",
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="w-1/2 text-white bg-gray-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                
                <div className="flex">
            
    <GoogleOAuthProvider clientId="133982942406-4naomvq0s544eb8or90eb8pqkfprkq1i.apps.googleusercontent.com">
      <div>        
      <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>


                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* )} */}
    </>
  );
};

export default AdminSignin;
