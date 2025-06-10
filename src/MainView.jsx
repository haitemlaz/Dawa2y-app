import { useState } from "react";
import Header from "./Header";
import PatientProfile from "./PatientProfile";
import Prescription from "./Prescription";
import { database } from "./firebase";
import { ref, get, set } from "firebase/database";
import Appointments from "./Appointments";

function MainView({ doctor, isAppointment, setIsAppointment, setIsSidebar }) {
  const [patient, setPatient] = useState({});
  const [prescription, setPrescription] = useState({});
  async function handlePrescription(prescription) {
    const recipesRef = ref(database, `patients/${patient.id}/recipes`);
    try {
      const snapshot = await get(recipesRef);
      if (snapshot.exists()) {
        const recipes = await snapshot.val();
        const recipesCount = Object.keys(recipes).length;

        console.log("recipes ", recipes);
        const newRecipeRef = ref(
          database,
          `patients/${patient.id}/recipes/${recipesCount}`
        );
        set(newRecipeRef, {
          ...prescription,
          drName: doctor.name,
        });
        setPrescription({ ...prescription, drName: doctor.name });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <>
      <Header
        setPatient={setPatient}
        setIsSidebar={setIsSidebar}
        doctorPic={doctor.pic}
      />
      <div className="main-content">
        {isAppointment ? (
          <Appointments />
        ) : (
          <>
            <PatientProfile patient={patient} setPatient={setPatient} />
            <Prescription handlePrescription={handlePrescription} />
          </>
        )}
      </div>
    </>
  );
}

export default MainView;
