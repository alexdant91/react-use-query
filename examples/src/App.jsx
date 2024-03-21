import { useQueryState, useQuerySelector, useQueryDispatcher } from './hooks';

import "./App.css";

const App = () => {
  const [data] = useQueryState("auth");

  const auth = useQuerySelector(({ auth }) => auth);
  const { login, logout } = useQueryDispatcher("auth");

  return (
    <>
      <div>
        <p>Token: {auth.token}</p>
        <p>User: {auth.user}</p>
        <button onClick={() => login({ token: "1234abcd", user: "Alex" })}>Login</button>
        <button onClick={() => logout()}>Logout</button>
      </div>
      <div className="container">
        <pre>
            // ====================== <br />
            // -------- DATA -------- <br />
            // ======================
            <br />
            <br />
            {data && JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </>
  )
}

export default App