import Home from './Home';
import { UserProvider } from "./contexts/user.context";
import { StateProvider } from './contexts/StateContext';
import './App.css';


function App() {
  return (
    <div className="App">
      <UserProvider>
        <StateProvider>
          <Home />
        </StateProvider>
      </UserProvider>
    </div>
  );
}

export default App;
