import { useState } from "react";
import logo from "./assets/logo.png";
import { auth, database } from "./firebase";

import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
function Login({ SetPage, setDoctor }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const doctorsRef = ref(database, "doctors");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const snapshot = await get(doctorsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const doctor = Object.values(data).find(
          (doctor) => doctor.email === email
        );
        setDoctor(doctor);
      }
      SetPage("patient");
      console.log("✅ Logged in as:", userCred.user);
    } catch (error) {
      console.error("❌ Login failed:", error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className="login-box">
        <h2>Doctor Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log in</button>
          <p className="forgot-password">Forgot password?</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
