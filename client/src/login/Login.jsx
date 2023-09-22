import { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import './Login.css';
import Beer from './beer-animation/Beer';

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
    // eslint-disable-next-line
  }, []);

  // CSS background logic (due to the beer pouring animation)
  useEffect(() => {
    document.body.classList.add("login-body");
    return () => {
      document.body.classList.remove("login-body");
    };
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
    alert("If you are a Lodger - Contact Cole for login help! Otherwise, login as a guest."); // Call the alert function inside the event handler
  }

  async function handleGuestLogin (event) {
    event.preventDefault();
    try {
      const user = await loginUser('guestFirstNameguestLastName', 'guestPassword');
      if (user) {
        redirectNow();
      }
      else {
        alert('Error logging in as a guest');
      }
    }
    catch (error) {
      console.log(error);
    }
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
        <div className='.login-header-text'>
          <h1>Hadd</h1>
          <h1>Bar</h1>
        </div>
        <Beer/>
      </div>
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
            inputMode="search"
          />
        <p onClick={handleForgetPasswordClick}>Forget Your Password?</p>
        </div>
        <button id='login-button' type="submit">Login</button>
        <button 
          id='guest-login-button' 
          type="button"
          onClick={handleGuestLogin}
        >Login as a Guest</button>
      </form>
    </div>
  );
};

export default Login;