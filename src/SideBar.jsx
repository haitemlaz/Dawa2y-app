import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import axios from 'axios';
function SideBar() {
  const [isAddFile,setAddFile]=useState(false)
  //start gpt code
  


  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
useEffect(()=>{async function handleUpload()    {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setResponse(res.data);
     console.log(res.data.analysis)
    } catch (err) {
      console.error(err);
    }
  }handleUpload(); },[file])
  

  //end gpt code 
  
  return (
    <div className="side-bar">
       <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul>
        <li>Diseases</li>
        <li>Prescription History</li>
        <li>Profile</li>
        <li onClick={() => setAddFile(prev => !prev)}>Add File</li>
        {
          isAddFile && <div className="pop-up add-file">
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
            />
            <button
              onClick={() => {
                console.log(response.analysis.choices.at(0).text)
                // Optionally trigger upload here if you want manual upload
                // For now, just close popup after setting file
                setAddFile(false);
              }}
            >
              submit
            </button>
          </div>
        }

      </ul>
    </div>
  );
}

export default SideBar;
