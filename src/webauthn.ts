function bufferDecode(value: string) {
  return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
}

function bufferEncode(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createCredential(options: any) {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: bufferDecode(options.challenge),
      rp: { name: "My App",id: window.location.hostname },
      user: { id: bufferDecode(options.userid), name: options.username, displayName: options.username },
      pubKeyCredParams: options.signatureAlgorithms.map((alg: any) => ({
        type: "public-key",
        alg: alg
      })),
      authenticatorSelection: { 
        authenticatorAttachment: "cross-platform",  
        userVerification: "preferred", 
        residentKey: "required" 
      },
      attestation: "direct",
    },
  });

  return credential;
}

export async function getAssertion(options: any) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: bufferDecode(options.challenge),      
      allowCredentials: options.allowCredentials.map((cred: any) => ({
        id: bufferDecode(cred),
        type: "public-key"
      })),
      timeout: 60000,
      userVerification: "preferred"
    }
  }) as PublicKeyCredential;

  return {
    id: assertion.id,
    rawId: bufferEncode(assertion.rawId),
    type: assertion.type,
    response: {
      clientDataJSON: bufferEncode(assertion.response.clientDataJSON),
      authenticatorData: bufferEncode((assertion.response as AuthenticatorAssertionResponse).authenticatorData),
      signature: bufferEncode((assertion.response as AuthenticatorAssertionResponse).signature),
      userHandle: bufferEncode((assertion.response as AuthenticatorAssertionResponse).userHandle || new ArrayBuffer(0))
    }
  };
}