import { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./contexts/user.context";
import './Login.css';
import beerLogo from './static/beerLogo.png';

function Login () {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();
  const location = useLocation();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // We are consuming our user-management context to 
  // get & set the user details here
  const { user, fetchUser, loginUser } = useContext(UserContext);

    // This useEffect will run only once when the component is mounted.
  // Hence this is helping us in verifying whether the user is already logged in
  // or not.
  useEffect(() => {
    // Since there can be chances that the user is already logged in
    // but whenever the app gets refreshed the user context will become
    // empty. So we are checking if the user is already logged in and
    // if so we are redirecting the user to the home page.
    // Otherwise we will do nothing and let the user to login.
    async function loadUser () {
      if (!user) {
        const fetchedUser = await fetchUser();
        if (fetchedUser) {
          // Redirecting them once fetched.
          redirectNow();
        }
      }
    }
    loadUser(); 
  }, []);



  // This function will be called whenever the user edits the form.
  function onFormInputChange (event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // This function will redirect the user to the 
  // appropriate page once the authentication is done.
  function redirectNow () {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // prevent the default form submission behavior
      if (event.target.name === "username") {
        passwordInputRef.current.focus();
      } else if (event.target.name === "password") {
        onSubmit(event);
      }
    }
  }

  function handleForgetPasswordClick() {
    alert("If you are a Lodger - Cole for login help! Otherwise, this is not for you."); // Call the alert function inside the event handler
  }

  // This function gets fired when the user clicks on the "Login" button.
  async function onSubmit (event) {
    event.preventDefault(); // keeps form data out of URL
    try {
      // Here we are passing user details to our emailPasswordLogin
      // function that we imported from our realm/authentication.js
      // to validate the user credentials and login the user into our App.
      const user = await loginUser(form.username, form.password);
      if (user) {
        redirectNow();
      }
      else {
        alert("Invalid username or password");
        setForm({ username: "", password: "" });
        passwordInputRef.current.blur();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="login-header">
        <h1>Hadd</h1>
        <img src={beerLogo} alt="logo"/>
        <h1>Bar</h1>
      </div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className="input-container">
          <input
            className="username-input"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onFormInputChange}
            onKeyDown={handleKeyDown}
            ref={usernameInputRef}
          />
          <input
            className="password-input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onFormInputChange}
            onKeyDown={handleKeyDown}
            ref={passwordInputRef}
            autoComplete="current-password"
            inputmode="search"
          />
        <p onClick={handleForgetPasswordClick}>Forget Your Password?</p>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;