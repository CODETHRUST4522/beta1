import { Link } from "react-router-dom";

function Register() {
  return (
    <div>
      <h1>Register Page</h1>

      <Link to="/">Login</Link>
      <br />
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default Register;