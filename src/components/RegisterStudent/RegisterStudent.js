import React, { useState } from "react";

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
    profilePhotoUrl: "",
    skills: { role: "batsman", handedness: "right", wicketKeeper: false, tags: [] },
    extraInfo: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, skills: { ...f.skills, tags: [...f.skills.tags, v] } }));
    setTagInput("");
  };

  const removeTag = (idx) => {
    setForm((f) => ({
      ...f,
      skills: { ...f.skills, tags: f.skills.tags.filter((_, i) => i !== idx) },
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registration successful. You can now log in.");
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
          profilePhotoUrl: "",
          skills: { role: "batsman", handedness: "right", wicketKeeper: false, tags: [] },
          extraInfo: "",
        });
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Network error. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: 20 }}>
      <h2>Student Registration</h2>
      <form onSubmit={submit}>
        <h3>Account</h3>
        <input name="username" placeholder="Username" value={form.username} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />

        <h3>Personal</h3>
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={onChange} required />
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={onChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        <input name="gender" placeholder="Gender" value={form.gender} onChange={onChange} />
        <input name="dob" type="date" placeholder="DOB" value={form.dob} onChange={onChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={onChange} />
        <input name="batch" placeholder="Preferred Batch" value={form.batch} onChange={onChange} />
        <input name="parentName" placeholder="Parent Name" value={form.parentName} onChange={onChange} />
        <input name="parentPhone" placeholder="Parent Phone" value={form.parentPhone} onChange={onChange} />
        <input name="profilePhotoUrl" placeholder="Profile Photo URL" value={form.profilePhotoUrl} onChange={onChange} />

        <h3>Skills</h3>
        <label>
          Role:
          <select name="role" value={form.skills.role} onChange={onSkillChange}>
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All-rounder</option>
          </select>
        </label>
        <label>
          Handedness:
          <select name="handedness" value={form.skills.handedness} onChange={onSkillChange}>
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </label>
        <label>
          <input type="checkbox" name="wicketKeeper" checked={form.skills.wicketKeeper} onChange={onSkillChange} /> Wicket Keeper
        </label>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Add skill tag (e.g., Leg spin)" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
          <button type="button" onClick={addTag}>Add Tag</button>
          <div style={{ marginTop: 8 }}>
            {form.skills.tags.map((t, i) => (
              <span key={i} style={{ marginRight: 6 }}>
                {t} <button type="button" onClick={() => removeTag(i)}>x</button>
              </span>
            ))}
          </div>
        </div>

        <h3>Other</h3>
        <textarea name="extraInfo" placeholder="Extra Info" value={form.extraInfo} onChange={onChange} />

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Register'}</button>
        </div>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
};

export default RegisterStudent;


