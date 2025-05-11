import { useState } from "react";
import "./App.css";
import Header from "./Header";
import MainView from "./MainView";
import SideBar from "./SideBar";

function App() {
  const [isAddMedOpen, setisAddMedOpen] = useState(false);

  const isOpen = true;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setisAddMedOpen(false);
      }}
    >
      <Header />
      <div className="main-content">
        {isOpen ? <SideBar /> : null}

        <MainView
          isAddMedOpen={isAddMedOpen}
          setisAddMedOpen={setisAddMedOpen}
        />
      </div>
    </div>
  );
}

export default App;
