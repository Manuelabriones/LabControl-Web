import { UserRound, Mail, ShieldCheck } from "lucide-react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>My Profile</h1>
            <p>View your account information.</p>
          </div>
        </header>

        <section className="profile-card">
          <div className="profile-avatar">
            <UserRound size={45} />
          </div>

          <h2>{user?.nombre || user?.name || "User"}</h2>

          <div className="profile-detail">
            <Mail size={20} />
            <div>
              <span>Email Address</span>
              <p>{user?.email || "Not available"}</p>
            </div>
          </div>

          <div className="profile-detail">
            <ShieldCheck size={20} />
            <div>
              <span>Account Role</span>
              <p>{user?.rol || user?.role || "USER"}</p>
            </div>
          </div>

          <div className="profile-detail">
            <UserRound size={20} />
            <div>
              <span>Student ID</span>
              <p>{user?.matricula || "Not available"}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
