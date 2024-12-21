import ClipLoader from "react-spinners/ClipLoader";
const Loader = () =>{return(
<>
<div  className="fixed inset-0 flex justify-center items-center   bg-gray-900 bg-opacity-70 z-40" >

    <ClipLoader
      
      color={"white"}
      loading={true}
      size={50} // Size of the spinner
      aria-label="Loading Spinner"
      data-testid="loader"
    />
    </div> 

    </>
    )}

    export default Loader

