import React, { useState } from 'react';
import {
  getRegisterChallenge,
  verifyRegistration,
  getLoginChallenge,
  verifyLogin
} from './api';
import { createCredential, getAssertion } from './webauthn';

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const register = async () => {
    setMessage('Đang gửi yêu cầu đăng ký...');    
    const challenge = await getRegisterChallenge(username);
    console.log("Challenge created:", challenge);

    const credential = await createCredential(challenge);
    console.log("Passkey created:", credential);
    
    const result = await verifyRegistration(username, credential) ;
    setMessage(result.success ? 'Đăng ký thành công!' : 'Đăng ký thất bại'); 
  };

  const login = async () => {
    setMessage('Đang gửi yêu cầu đăng nhập...');
    const challenge = await getLoginChallenge(username);
    const assertion = await getAssertion(challenge);
    const result = await verifyLogin(username, challenge, assertion);
    setMessage(result.access_token ? 'Đăng nhập thành công!' : 'Đăng nhập thất bại');
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>🔐 Passkey (FIDO2) Demo</h2>
      <input
        type="text"
        placeholder="Nhập username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: 8, marginBottom: 10 }}
      />
      <br />
      <button onClick={register} style={{ marginRight: 10 }}>Đăng ký Passkey</button>
      <button onClick={login}>Đăng nhập bằng Passkey</button>
      <p>{message}</p>
    </div>
  );
}

export default App;