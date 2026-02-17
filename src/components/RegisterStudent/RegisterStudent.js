import React, { useState } from "react";
import "./RegisterStudent.css";
import { useNavigate } from "react-router-dom";

const RegisterStudent = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    batch: "",
    parentName: "",
    parentPhone: "",
    profilePhoto: null,
    skills: {
      role: "",
      battingHand: "",
      bowlingHand: "",
      wicketKeeper: false,
      bowlingType: "",
    },
    extraInfo: "",
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const onChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        setForm((f) => ({ ...f, [name]: file }));
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const onSkillChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      skills: {
        ...f.skills,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      
      // Add all form fields
      formData.append("username", form.username);
      formData.append("password", form.password);
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("gender", form.gender);
      formData.append("dob", form.dob);
      formData.append("address", form.address);
      formData.append("batch", form.batch);
      formData.append("parentName", form.parentName);
      formData.append("parentPhone", form.parentPhone);
      formData.append("extraInfo", form.extraInfo);
      
      // Add skills
      formData.append("skills", JSON.stringify(form.skills));
      
      // Add profile photo if selected
      if (form.profilePhoto) {
        formData.append("profilePhoto", form.profilePhoto);
      }

      const res = await fetch("http://localhost:5000/api/auth/register-student", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registration successful! You can now log in with your username and password.");
        setForm({
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: "",
          dob: "",
          address: "",
          batch: "",
          parentName: "",
          parentPhone: "",
          profilePhoto: null,
          skills: {
            role: "",
            battingHand: "",
            bowlingHand: "",
            wicketKeeper: false,
            bowlingType: "",
          },
          extraInfo: "",
        });
        setProfilePhotoPreview(null);
      } else {
        setMessage(`❌ ${data.message || data.error || "Registration failed. Please check your inputs."}`);
      }
    } catch (err) {
      setMessage("❌ Network error. Please check your connection and try again.");
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isBatsman = form.skills.role === "batsman";
  const isBowler = form.skills.role === "bowler";
  const isAllrounder = form.skills.role === "all-rounder";

  return (
    <div className="register-student-container">
      <div className="register-student-card">
        <h2 className="register-title">🏏 Student Registration</h2>
        <form onSubmit={submit} className="register-form">
          {/* Account Section */}
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input
                  name="username"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={onChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={onChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Preferred Batch</label>
                <input
                  name="batch"
                  placeholder="Batch"
                  value={form.batch}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <div className="photo-upload-container">
                  {profilePhotoPreview ? (
                    <div className="photo-preview">
                      <img src={profilePhotoPreview} alt="Preview" />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, profilePhoto: null }));
                          setProfilePhotoPreview(null);
                        }}
                        className="remove-photo-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="photo-upload-label">
                      <input
                        type="file"
                        name="profilePhoto"
                        accept="image/*"
                        onChange={onChange}
                        style={{ display: "none" }}
                      />
                      <span>📷 Upload Photo</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="form-section">
            <h3 className="section-title">Parent/Guardian Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Parent Name</label>
                <input
                  name="parentName"
                  placeholder="Parent Name"
                  value={form.parentName}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <label>Parent Phone</label>
                <input
                  name="parentPhone"
                  placeholder="Parent Phone"
                  value={form.parentPhone}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="form-section">
            <h3 className="section-title">Skills & Role</h3>
            <div className="form-group">
              <label>Select Your Role *</label>
              <select
                name="role"
                value={form.skills.role}
                onChange={onSkillChange}
                required
                className="role-select"
              >
                <option value="">Select Role</option>
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="all-rounder">All-rounder</option>
              </select>
            </div>

            {/* Batsman Options */}
            {(isBatsman || isAllrounder) && (
              <div className="skill-options-card">
                <h4 className="skill-subtitle">🏏 Batsman Options</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Batting Hand *</label>
                    <select
                      name="battingHand"
                      value={form.skills.battingHand}
                      onChange={onSkillChange}
                      required={isBatsman || isAllrounder}
                    >
                      <option value="">Select Hand</option>
                      <option value="right">Right Hand</option>
                      <option value="left">Left Hand</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="wicketKeeper"
                      checked={form.skills.wicketKeeper}
                      onChange={onSkillChange}
                    />
                    <span>Wicket Keeper (Optional)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Bowler Options */}
            {(isBowler || isAllrounder) && (
              <div className="skill-options-card">
                <h4 className="skill-subtitle">⚾ Bowler Options</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bowling Hand *</label>
                    <select
                      name="bowlingHand"
                      value={form.skills.bowlingHand}
                      onChange={onSkillChange}
                      required={isBowler || isAllrounder}
                    >
                      <option value="">Select Hand</option>
                      <option value="right">Right Hand</option>
                      <option value="left">Left Hand</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bowling Type *</label>
                    <select
                      name="bowlingType"
                      value={form.skills.bowlingType}
                      onChange={onSkillChange}
                      required={isBowler || isAllrounder}
                    >
                      <option value="">Select Type</option>
                      <option value="fast">Fast Bowler</option>
                      <option value="medium-fast">Medium Fast</option>
                      <option value="spinner">Spinner</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Extra Info */}
          <div className="form-section">
            <h3 className="section-title">Additional Information</h3>
            <div className="form-group">
              <label>Extra Info</label>
              <textarea
                name="extraInfo"
                placeholder="Any additional information..."
                value={form.extraInfo}
                onChange={onChange}
                rows="4"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
        {message && (
          <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterStudent;
