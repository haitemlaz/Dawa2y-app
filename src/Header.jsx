import { useEffect, useState } from "react";
import { database } from "./firebase";
import { ref as dbRef, get } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import AddPatient from "./AddPatient";

function Header({ setPatient, setIsSidebar, doctorPic }) {
  const [searchQuery, setsearchQuery] = useState("");
  const [results, setResults] = useState("");
  const [docImgUrl, setDocImgUrl] = useState();
  const [showAddPatient, setShowAddPatient] = useState(false);

  useEffect(() => {
    const storage = getStorage();
    const imgRef = storageRef(storage, `drsImgs/${doctorPic}`);
    getDownloadURL(imgRef).then((url) => setDocImgUrl(url));
  }, [doctorPic]);
  console.log(results);
  useEffect(() => {
    async function search() {
      if (searchQuery === "") {
        setResults([]);
        return;
      }

      const patientsRef = dbRef(database, "patients"); // path to your users
      // const q = query(patientsRef, orderByChild("name"), equalTo(searchQuery));

      // Make sure 'get' is imported from 'firebase/database'
      // import {  } from "firebase/database";
      const snapshot = await get(patientsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // searchQuery.toLowerCase().trim();
        const filteredUsers = Object.values(data).filter((Patient) =>
          Patient.name
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase().trim())
        );
        console.log("data :", data, "🔍 Results:", filteredUsers);
        setResults(filteredUsers);
      } else {
        setResults([]);
      }
    }
    search();
    // return () => unsubscribe();
  }, [searchQuery]);
  return (
    <>
      {" "}
      <header className="header">
        <img
          className="header-doctor-img"
          src={docImgUrl}
          alt="Doctor"
          onClick={() => setIsSidebar((state) => !state)}
        />
        <input
          type="text"
          placeholder="Search for a patient ..."
          onChange={(e) => setsearchQuery(e.target.value)}
          value={searchQuery}
          // onFocus={(e) => setsearchQuery(e.target.value)}
        />
        <button
          className="btn-add-patient"
          onClick={() => setShowAddPatient(true)}
        >
          Add Patient
        </button>
        {searchQuery && (
          <div className="SearchResults">
            {results.length ? (
              results.map((e, i) => (
                <PatientSuggestion
                  patient={e}
                  key={i}
                  setPatient={setPatient}
                  setsearchQuery={setsearchQuery}
                />
              ))
            ) : (
              <div> no results</div>
            )}
          </div>
        )}
        {searchQuery && (
          <div className="overlay" onClick={() => setsearchQuery("")}></div>
        )}{" "}
      </header>
      {showAddPatient && (
        <>
          <div className="overlay" onClick={() => setShowAddPatient(false)} />
          <AddPatient onClose={() => setShowAddPatient(false)} />
        </>
      )}
    </>
  );
}
function PatientSuggestion({ patient, setPatient, setsearchQuery }) {
  return (
    <div
      className="suggestion"
      onClick={() => {
        setPatient(patient);
        setsearchQuery("");
      }}
    >
      {patient.name}
    </div>
  );
}

export default Header;
