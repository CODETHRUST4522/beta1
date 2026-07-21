import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Link to="/">Login</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Dashboard;