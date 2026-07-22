import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Register() {
  
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
const [mobile, setMobile] = useState("");
const [village, setVillage] = useState("");
const [taluka, setTaluka] = useState("");
const [district, setDistrict] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  fullName,
  mobile,
  village,
  taluka,
  district,
  email,
  createdAt: new Date(),
});

alert("Account created successfully!");
navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <input
  type="text"
  placeholder="Full Name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
/>
<br /><br />

<input
  type="tel"
  placeholder="Mobile Number"
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
/>
<br /><br />

<input
  type="text"
  placeholder="Village"
  value={village}
  onChange={(e) => setVillage(e.target.value)}
/>
<br /><br />

<input
  type="text"
  placeholder="Taluka"
  value={taluka}
  onChange={(e) => setTaluka(e.target.value)}
/>
<br /><br />

<input
  type="text"
  placeholder="District"
  value={district}
  onChange={(e) => setDistrict(e.target.value)}
/>
<br /><br />
<input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>
<br /><br />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;