
import { useState } from "react";
import {
  UserRound,
  Mail,
  IdCard,
  UsersRound,
  CalendarDays,
  Pencil,
  Eye,
  EyeOff,
  X,
  Check,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

const Profile = () => {
  const { user } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      nombre: user?.nombre || user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
    });
  };

  const displayName =
    user?.nombre || user?.name || "User";

  const userId =
    user?.matricula || user?.userId || user?.id || "Not available";

  const role = user?.rol || user?.role || "USER";

  return (
    <div className="profile-page">
      <div className="profile-content">

        {/* User Information */}
        <section className="profile-info-card">

          <div className="profile-avatar">
            <UserRound size={42} />
          </div>

          <h2>{displayName}</h2>

          <span className="profile-role">{role}</span>

          <div className="profile-divider"></div>

          <div className="profile-detail">
            <Mail />
            <div>
              <span>Email</span>
              <p>{user?.email || "Not available"}</p>
            </div>
          </div>

          <div className="profile-detail">
            <IdCard />
            <div>
              <span>User ID</span>
              <p>{userId}</p>
            </div>
          </div>

          <div className="profile-detail">
            <UsersRound />
            <div>
              <span>Role</span>
              <p>{role}</p>
            </div>
          </div>

          <div className="profile-detail">
            <CalendarDays />
            <div>
              <span>Member Since</span>
              <p>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>

        </section>

        {/* Update Information */}
        <section className="profile-edit-card">

          <h2>
            <Pencil size={21} />
            Update Information
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>

            <div className="profile-field">
              <label>Full Name <span>*</span></label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label>Email <span>*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label>Current Password <span>*</span></label>
              <div className="password-input">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="profile-field">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                >
                  {showNewPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel"
                onClick={handleCancel}
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save"
              >
                <Check size={17} />
                Save Changes
              </button>
            </div>

          </form>
        </section>

      </div>
    </div>
  );
};

export default Profile;
