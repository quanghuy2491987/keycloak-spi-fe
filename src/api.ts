const BASE_URL = 'https://keycloak.isurvey.vn/realms/master';

export async function getRegisterChallenge(username: string) {
  const res = await fetch(`${BASE_URL}/passkey/challenge?username=${encodeURIComponent(username)}`, {
    method: 'GET'
  });
  return res.json();
}

export async function getLoginChallenge(username: string) {
  const res = await fetch(`${BASE_URL}/passkey/get-credential-id?username=${encodeURIComponent(username)}`, {
    method: 'GET'
  });
  return res.json();
}

export async function verifyRegistration(username: string, credential: any) {
  const res = await fetch(`${BASE_URL}/passkey/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      credentialId: credential.id,
      attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
      clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
    })
  });
  return res.json();  
}

export async function verifyLogin(username: string,challenge: any, credential: any) {
  const res = await fetch(`${BASE_URL}/passkey/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username,
      challenge: challenge.challenge,
      rawId: credential.rawId,
      credentialId: credential.id,
      authenticatorData: credential.response.authenticatorData,
      clientDataJSON: credential.response.clientDataJSON,
      signature: credential.response.signature,
      clientId: "security-admin-console"
    })
  });  
  
  return res.json();
}