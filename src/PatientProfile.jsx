import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import AddFile from "./AddFile";
import aiIcon from "./assets/aiIcon.png";
import AnalyseFile from "./AnalyseFile";
import RecipeHistory from "./RecipeHistory";

function PatientProfile({ patient, setPatient }) {
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
  const [showRecipes, setShowRecipes] = useState(false);

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
            <p>
              <strong onClick={() => setShowRecipes((state) => !state)}>
                Recipe History:
              </strong>
            </p>{" "}
            <p className={insurence === 0 ? "unavailable" : "available"}>
              <strong>Insurance:</strong>
              {insurence === 0 ? "Unavailable" : "Available"}
            </p>
            <div>
              <strong>Files:</strong>
              {files
                ? files.map((file, idx) => (
                    <span className="patient-file" key={idx}>
                      {file.fileName}
                      <img
                        src={aiIcon}
                        alt="AI Analysis"
                        className="ai-icon"
                        title="generate report with AI"
                        onClick={() => setFileURL(file.fileURL)}
                      />
                      {idx < files.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "none"}
              <strong
                className="add-file-btn"
                onClick={() => setIsAddFile(true)}
              >
                + Add
              </strong>
            </div>
          </>
        ) : (
          "No Patient is Selected"
        )}
      </div>
      {fileURL && <AnalyseFile fileURL={fileURL} />}
      {showRecipes && <RecipeHistory patient={patient} />}
      {isAddFile && (
        <AddFile
          patient={patient}
          setIsAddFile={setIsAddFile}
          setPatient={setPatient}
        />
      )}

      {(fileURL || showRecipes || isAddFile) && (
        <>
          <div
            className="overlay"
            onClick={() => {
              setFileURL(null);
              setShowRecipes(false);
              setIsAddFile(false);
            }}
          ></div>
        </>
      )}
    </>
  );
}

export default PatientProfile;
