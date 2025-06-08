import { useState } from "react";
import "./App.css";
import Header from "./Header";
import MainView from "./MainView";
import SideBar from "./SideBar";
import StartMenu from "./StartMenu";
import { useEffect } from "react";
import firebaseApp from "./firebase";
import Login from "./login";
import { auth, database } from "./firebase";
import { ref, get } from "firebase/database";
import Appointments from "./Appointments";
function App() {
  const [isAppointment, setIsAppointment] = useState(false);

  const [page, SetPage] = useState("");
  const [doctor, setDoctor] = useState(null);

  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    try {
      const appName = firebaseApp.name;
      console.log(`✅ Firebase initialized: ${appName}`);
    } catch (error) {
      console.error("❌ Firebase connection failed:", error);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("user", user);

        // User is signed in, fetch doctor data
        const doctorsRef = ref(database, "doctors");
        const snapshot = await get(doctorsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const doctorData = Object.values(data).find(
            (doc) => doc.email === user.email
          );
          console.log("doctorData", doctorData);
          setDoctor(doctorData);
          SetPage("patient");
        }
      } else {
        SetPage("login");
        setDoctor(null);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
      {}
      {!doctor ? (
        <Login SetPage={SetPage} setDoctor={setDoctor} />
      ) : (
        <div className="workspace">
          {isSidebar && (
            <SideBar
              doctor={doctor}
              setIsAppointment={setIsAppointment}
              className={isSidebar ? "side-bar" : "side-bar closed"}
            />
          )}
          <div className="main">
            {page === "start" && <StartMenu SetPage={SetPage} />}
            <MainView
              isAppointment={isAppointment}
              doctor={doctor}
              setIsSidebar={setIsSidebar}
              // handlePrescription={handlePrescription}
              // // isAddMedOpen={isAddMedOpen}
              // // setisAddMedOpen={setisAddMedOpen}
              // setPatient={setPatient}
              // patient={patient}
            />
          </div>
        </div>
      )}
      {/* {!doctor && <Login SetPage={SetPage} setDoctor={setDoctor} />} */}
    </>
  );
}
export default App;
