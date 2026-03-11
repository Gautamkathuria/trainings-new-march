import { useState } from "react";

// Read from the env.js file - note the correct variable path
const backendUrl = window._env_?.REACT_APP_BACKEND_URL || "http://localhost:4000";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async () => {
    if (!name || !email) {
      alert("Fill all fields");
      return;
    }
    try {
      // FIX: Use parentheses, not backticks for fetch
      const res = await fetch(`${backendUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      
      if (!res.ok) throw new Error("POST failed");
      
      alert("Saved successfully");
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("POST failed — check console");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>User Form</h2>
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Name" 
      />
      <br /><br />
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="Email" 
      />
      <br /><br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default App;
