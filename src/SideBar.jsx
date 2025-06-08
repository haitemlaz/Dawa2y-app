import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import axios from "axios";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

function SideBar({ doctor, setIsAppointment }) {
  const [isAddFile, setAddFile] = useState(false);
  //start gpt code

  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [docImgUrl, setDocImgUrl] = useState("");

  useEffect(() => {
    const storage = getStorage();
    const imgRef = ref(storage, `drsImgs/${doctor.pic}`);
    getDownloadURL(imgRef).then((url) => setDocImgUrl(url));
  }, [doctor.pic]);

  useEffect(() => {
    async function handleUpload() {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          "http://localhost:8000/analyze",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setResponse(res.data);
        console.log(res.data.analysis);
      } catch (err) {
        console.error(err);
      }
    }
    handleUpload();
  }, [file]);

  //end gpt code

  return (
    <div className="side-bar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="doctor">
        <img src={docImgUrl} />
        <h2>Dr.{doctor.name}</h2>
        <div className="speciality">{doctor.speciality}</div>
      </div>
      <ul>
        <li onClick={() => setIsAppointment(false)}>Make Prescription</li>
        <li onClick={() => setIsAppointment(true)}>Appointments</li>
        <li onClick={() => setAddFile((prev) => !prev)}>Add File</li>
        {isAddFile && (
          <div className="pop-up add-file">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button
              onClick={() => {
                console.log(response.analysis.choices.at(0).text);
                // Optionally trigger upload here if you want manual upload
                // For now, just close popup after setting file
                setAddFile(false);
              }}
            >
              submit
            </button>
          </div>
        )}
        <li
          onClick={async () => {
            await signOut(auth);
          }}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
