import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import AddFile from "./AddFile";
import aiIcon from "./assets/aiIcon.png";
import AnalyseFile from "./AnalyseFile";

function PatientProfile({ patient }) {
  const {
    name,
    "birth date": birthDate,
    sex,
    phone,
    email,
    diseases,
    insurence,
    files,
  } = patient;
  const [img, setImg] = useState(null);
  const [isAddFile, setIsAddFile] = useState(false);
  const [fileURL, setFileURL] = useState(null);

  useEffect(() => {
    setImg("");
    if (patient.pic) {
      const storage = getStorage();

      const fileRef = ref(storage, `patientsImgs/${patient.pic}`);

      getDownloadURL(fileRef)
        .then((url) => {
          setImg(url);
        })
        .catch((error) => {
          console.error("Error getting file:", error);
        });
    }
    return setFileURL(null);
  }, [patient.pic]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";

    const [day, month, year] = birthDate.split("/");
    const dob = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };
  return (
    <>
      <div className=" pop-up profile">
        {patient && name ? (
          <>
            <div className="profile-header">
              <img src={img} alt="Patient" />
              <h2>{name}</h2>
            </div>
            <p>
              <strong>Age:</strong> {calculateAge(birthDate)}
            </p>
            <p>
              <strong>Gender:</strong> {sex}
            </p>
            <p>
              <strong>Phone:</strong> {phone}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Diseases:</strong>
              {diseases ? diseases.map((item) => `${item}, `) : "none"}
            </p>
            <p className={insurence === 0 ? "unavailable" : "available"}>
              <strong>Insurance:</strong>
              {insurence === 0 ? "Unavailable" : "Available"}
            </p>
            <div>
              <p>
                <strong>Files:</strong>{" "}
                {files
                  ? files.map((file, idx) => (
                      <span className="patient-file" key={idx}>
                        {file.fileName}
                        <img
                          src={aiIcon}
                          alt="AI Analysis"
                          className="ai-icon"
                          title="Analyse with AI"
                          onClick={() => setFileURL(file.fileURL)}
                        />
                        {idx < files.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : ""}
                <strong onClick={() => setIsAddFile(true)}> Add</strong>{" "}
              </p>
              {isAddFile ? <AddFile patient={patient} /> : ""}
            </div>
          </>
        ) : (
          "No Patient is Selected"
        )}
      </div>
      {fileURL && <AnalyseFile fileURL={fileURL} />}
    </>
  );
}

export default PatientProfile;
