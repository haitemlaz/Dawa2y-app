import { useState } from "react";
import Header from "./Header";
import PatientProfile from "./PatientProfile";
import Prescription from "./Prescription";
import { database } from "./firebase";
import { ref, get, set } from "firebase/database";
import Appointments from "./Appointments";
import { generatePDF } from "./generatePDF";

function MainView({ doctor, isAppointment, setIsAppointment, setIsSidebar }) {
  const [patient, setPatient] = useState({});
  const [prescription, setPrescription] = useState({});
  async function handlePrescription(prescription) {
    if (!patient.id) {
      console.error("No patient selected.");
      return;
    }
    const recipesRef = ref(database, `patients/${patient.id}/recipes`);

    try {
      const snapshot = await get(recipesRef);
      let recipesCount = 0;
      if (snapshot.exists()) {
        const recipes = snapshot.val();
        recipesCount = Object.keys(recipes).length;
      }
      const newRecipeRef = ref(
        database,
        `patients/${patient.id}/recipes/${recipesCount}`
      );
      await set(newRecipeRef, {
        ...prescription,
        drName: doctor.name,
      });
      setPrescription({ ...prescription, drName: doctor.name });
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  }

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
  const handlePrint = async () => {
    const recipesRef = ref(database, `patients/${patient.id}/recipes`);

    const snapshot = await get(recipesRef);
    let recipesCount = 0;
    if (snapshot.exists()) {
      const recipes = snapshot.val();
      recipesCount = Object.keys(recipes).length;
    }
    generatePDF({
      doctor,
      patient,
      duration: prescription.duration,
      medicines: prescription.medicines,
      prescriptionId: `${patient.id}-${recipesCount}`,
      calculateAge,
    });
    console.log(patient, prescription);
  };
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
            <Prescription
              handlePrescription={handlePrescription}
              handlePrint={handlePrint}
            />
          </>
        )}
      </div>
    </>
  );
}

export default MainView;
