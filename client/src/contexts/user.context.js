import {createContext, useState} from 'react';
import {App, Credentials, User} from 'realm-web';

// Creating a Realm App Instance
const app = new App('application-0-gydmq');

export const UserContext = createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState(null);

    // Function to log in user into the VirtualHadd Database using their username & password
    const login = async (username, password) => {
        // TODO : Implement actual login with accounts
        // const credentials = Credentials.emailPassword(username, password);
        const credentials = Credentials.anonymous();
        try {
            const authenticatedUser = await app.logIn(credentials);
            setUser(authenticatedUser);
            return authenticatedUser;
        }
        catch (error) {
            console.error("Failed to log in", error);
            return null;
        }
    }

    const logout = async () => {
        if (!app.currentUser) return false;
        try {
            await app.currentUser.logOut();
            setUser(null);
            return app.currentUser;
        }
        catch (error) {
            throw error;
        }
    }

    return <UserContext.Provider value={{user, login, logout}}>{children}</UserContext.Provider>;

};