import { useEffect, useState } from "react";
import { database } from "./firebase";
import {
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
  onValue,
  equalTo,
  get,
} from "firebase/database";
function Header({ setPatient }) {
  const [searchQuery, setsearchQuery] = useState("");
  const [results, setResults] = useState("");
  console.log(results);
  useEffect(() => {
    async function search() {
      if (searchQuery === "") {
        setResults([]);
        return;
      }

      const patientsRef = ref(database, "patients"); // path to your users
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
    <header className="header">
      <input
        type="text"
        placeholder="Search for a patient ..."
        onChange={(e) => setsearchQuery(e.target.value)}
        value={searchQuery}
        // onFocus={(e) => setsearchQuery(e.target.value)}
      />
      <button className="btn-add-patient">Add Patient</button>
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
