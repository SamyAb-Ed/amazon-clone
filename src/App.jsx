import "./App.css";
import Routing from "./Pages/Router";
import { AuthProvider } from "./Components/AuthProvider/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

export default App;
