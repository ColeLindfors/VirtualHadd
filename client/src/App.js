import Home from './Home';
import { UserProvider } from "./contexts/user.context";


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
