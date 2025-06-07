import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

function PatientProfile({ patient }) {
  const {
    name,
    "birth date": birthDate,
    sex,
    phone,
    email,
    diseases,
    insurence,
  } = patient;
  const [img, setImg] = useState("");

  useEffect(() => {
    setImg("");
    if (patient.pic) {
      const storage = getStorage();

      const fileRef = ref(storage, `patientsImgs/${patient.pic}`);

      getDownloadURL(fileRef)
        .then((url) => {
          console.log("File URL:", url);
          setImg(url);
        })
        .catch((error) => {
          console.error("Error getting file:", error);
        });
    }
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
        </>
      ) : (
        "No Patient is Selected"
      )}
    </div>
  );
}

export default PatientProfile;
