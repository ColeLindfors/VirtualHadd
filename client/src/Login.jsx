import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./contexts/user.context";

function Login () {
  const navigate = useNavigate();
  const location = useLocation();

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

  // We are using React's "useState" hook to keep track
  //  of the form values.
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

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
    } catch (error) {
      alert(error)
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={onFormInputChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={onFormInputChange}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;