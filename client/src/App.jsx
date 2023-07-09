import Home from './Home';
import { UserProvider } from "./contexts/user.context";
import './App.css';


function App() {
  return (
    <div className="App">
      <UserProvider>
        <Home />
      </UserProvider>
    </div>
  );
}

export default App;
