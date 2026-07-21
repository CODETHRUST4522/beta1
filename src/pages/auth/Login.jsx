import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>Login Page</h1>

      <Link to="/register">Register</Link>
      <br />
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default Login;