import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../../assets/bgbgbg.jpeg";
import StudentService from "../../services/studentService";

export default function LoginComp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitForm = async () => {
    // Admin login (hardcoded as per project)
    if (email === "admin" && password === "admin") {
      localStorage.setItem("role", "admin");
      navigate("/admin/dashboard");
      return;
    }

    try {
      const credentials = {
        userName: email,
        password: password
      };

      const res = await StudentService.login(credentials);

      if (res.data === "Login successful1") {
        alert("First login. Please change password.");
        const studentRes = await StudentService.getStudentByEmail(email);

        localStorage.setItem("role", "student");
        localStorage.setItem("studentId", studentRes.data.studentId);
        localStorage.setItem("name", studentRes.data.name);

        navigate("/student/changePassword/");
      } 
      else if (res.data === "Login successful1 successful2") {
        const studentRes = await StudentService.getStudentByEmail(email);

        localStorage.setItem("role", "student");
        localStorage.setItem("studentId", studentRes.data.studentId);
        localStorage.setItem("name", studentRes.data.name);

        navigate("/student/dailymenu/");
      } 
      else {
        setMessage(res.data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${bgimg})`,
      }}
    >
      <div style={{ border: "1px solid #007bff", padding: "20px", width: "400px" }}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <button onClick={submitForm}>Login</button>
        <p style={{ color: "red" }}>{message}</p>
      </div>
    </div>
  );
}
