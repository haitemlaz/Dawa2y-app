import logo from "./assets/logo.png";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar">
        <input type="text" placeholder="Search for a patient ..." />
        <button className="btn-add-patient">Add Patient</button>
      </div>
    </header>
  );
}

export default Header;
