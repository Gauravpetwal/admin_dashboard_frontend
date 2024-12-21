import { useState,useEffect,useRef } from "react"
import { Send,MoveLeft,Paperclip } from "lucide-react"
import { useNavigate,useLocation } from "react-router-dom"
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import { io} from 'socket.io-client';
const socktetUrl = 'http://localhost:5000'
const token = localStorage.getItem('Token')
const socket = io(socktetUrl,{auth:{token:null}})





const SupportChat = () =>{
  const {state} =  useLocation()
    const navigate = useNavigate()
     const [ticketid, setTicketid] = useState(state.ticketid)
    const [message, setMessage] =useState('')
    const [messages, setMessages] = useState([])
    const [ticket, setTicket] = useState([])
    const successNotify = (message) => {return toast.success(message)};
    const errorsNotify = (message) => {return toast.error(message)};
    const [userid,setuserid] = useState(null)
    const fileInput = useRef(null)
    const [file,setFile] = useState(null)

    //get ticket info
    const getTicket = async () =>{
        try{            
            const url = `http://localhost:5000/api/ticket?id=${ticketid}`
            const {data} = await axios.get(url,{
                headers:{Authorization:`bearer ${token}`}
            })
            if(data.statusCode === 0) {
                return errorsNotify(data.message);
            }
            setuserid(data.data.ticket.userid)
           setTicket(data.data.ticket)
           setMessages(data.data.messages)           
    
        }catch(error){
          console.log(error)
            return errorsNotify(error.message)
    
        }
       }

        const onFileChange = (e) =>{
           const selectedFile = e.target.files[0]
           console.log(selectedFile)
           if (selectedFile) {
            const fileType = selectedFile.type;
            if (!fileType.startsWith("image/")) {
              setFile(null); // Reset file state
              errorsNotify("Please select a valid image file (JPG, JPEG, PNG).");
             return 
            } else {
          
             return setFile(selectedFile); // Set the selected file
            }
          }


          // setFile(e.target.files[0])
        }


        const SendMessage = async () =>{
          try{

            if (!message.trim() && !file) {
              errorsNotify("Please enter a message or select an image.");
              return; // Prevent submission if no message or file
            }        
            //the data which will send with the file
            const formData = new FormData();
            formData.append("file", file);
            formData.append("ticketid", ticketid); 
            formData.append("userid", userid);
            formData.append('message', message)
            formData.append('sendertype', 'admin')
            const url =`http://localhost:5000/api/ticket/sendMEssage`
            const {data} = await axios.post(url,formData,{
              headers:{
                "Content-Type": "multipart/form-data",
                Authorization:`bearer ${token}`
              }
            })
            
            if(data.statusCode === 0) return errorsNotify(data.message)
              if(data.statusCode === 1) {
                setMessage(" ")
                setMessages([...messages,data.data])
              setFile('')
              }

          }catch(error){
            
            return errorsNotify(error)
          }
        }  

    
    useEffect(()=>{
      getTicket()
       },[])
       socket.on(ticketid,(message)=>{
        setMessages([...messages, message])
      })
    return(
        <>
        <ToastContainer/>

        {ticket && (
  <div className="min-h-screen flex items-center justify-center py-1 px-6 sm:px-6 lg:px-8">
    <div className="bg-gray-800 w-full max-w-4xl shadow-lg rounded-lg p-6 flex flex-col h-full ">
      
      {/* Chat Header - This is fixed at the top */}
      <div className="flex items-center gap-4 border-b pb-4">
        <MoveLeft onClick={() => navigate('/support/Ticket', {state: {ticketid}})} className="text-white hover:cursor-pointer" />
        <h2 className="text-lg font-semibold text-white">{ticket.username}</h2>
      </div>

      {/* Chat Messages - This should be scrollable */}
      <div className="h-[600px] overflow-y-scroll space-y-4 p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sendertype === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg text-white ${msg.sendertype === 'admin' ? 'bg-blue-500' : 'bg-gray-700 text-gray-900'}`}>
              {msg.message}
            </div>
            <div>
              {msg.imgurl && <img src={`http://localhost:5000${msg.imgurl}`} alt="attachment"  className="w-full max-w-xs h-auto rounded-lg"/>}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input - This should be fixed at the bottom */}
      <div className="flex flex-col w-full space-y-2 mt-auto">
        {/* Display file name if available */}
        {file && <p className="text-sm text-gray-600 font-medium">{file.name}</p>}

        <form onSubmit={(e) => { e.preventDefault(); SendMessage(); }} encType="multipart/form-data" className="w-full">
          <div className="flex w-full justify-between items-center rounded-lg shadow-sm focus-within:ring-opacity-50 transition-all">
            
            {/* Paperclip Icon and File Input */}
            <div className="relative flex items-center w-full">
              <input
                type="file"
                id="fileInput"
                ref={fileInput}
                style={{ display: 'none' }}
                onChange={onFileChange}
              />
              <Paperclip
                onClick={() => fileInput.current.click()}
                className="absolute left-3 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
              />
              
              {/* Message Input */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 pl-12 pr-4 py-3 bg-gray-200 rounded-lg text-gray-900 placeholder-gray-500 border border-transparent focus:outline-none focus:ring-2 transition-all"
                placeholder="Type your message..."
              />
            </div>

            {/* Send Button */}
            <button type="submit" className="ml-2 bg-green-600 p-3 rounded-lg hover:bg-green-700 focus:outline-none transition-colors">
              <Send className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}


        </>
    )
    
}
export default SupportChat