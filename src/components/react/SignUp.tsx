import { useState } from "react";
import { authClient } from "../../lib/utils/react-auth-client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: (ctx) => {
          console.log(ctx);
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div>
      <div className="form-control">
        <input
          type="name"
          value={name}
          className="input"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button className="btn" onClick={signUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
