import React, { useState } from 'react';
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";

function App() {
  const [username, setUsername] = useState(null);

  const handleLogin = (user) => {
    setUsername(user);
  };

  return (
    <div>
      {username ? (
        <Dashboard username={username} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
