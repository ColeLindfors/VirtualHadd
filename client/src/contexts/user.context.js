import {createContext, useState} from 'react';
import {App, Credentials, User} from 'realm-web';

// Creating a Realm App Instance
const app = new App('application-0-gydmq');

export const UserContext = createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState(null);

    // Function to log in user into the VirtualHadd Database using their username & password
    async function loginUser (username, password) {
        const credentials = Credentials.function({
            username: username,
            password: password,
          });
        
        try {
            const authedUser = await app.logIn(credentials);
            setUser(authedUser);
            return authedUser;
        }
        catch (error) {
            console.error("Failed to log in", error);
            return null;
        }
    }

    // Function to fetch-user (if the user is already logged in) from local storage
    async function fetchUser () {
        if (!app.currentUser) return false;
        try {
            await app.currentUser.refreshCustomData();
            // Now if we have a user we are setting it to our user context
            // so that we can use it in our app across different components.
            setUser(app.currentUser);
            return app.currentUser;
        } catch (error) {
            throw error;
        }
    };

    async function logoutUser() {
        if (!app.currentUser) return false;
        try {
            await app.currentUser.logOut();
            setUser(null);
            return true;
        }
        catch (error) {
            throw error;
        }
    }

    return (
    <UserContext.Provider value={{user, loginUser, logoutUser, fetchUser}}>
        {children}
    </UserContext.Provider>
    );

};