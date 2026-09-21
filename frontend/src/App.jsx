import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import './App.css'
import { Routes, Route} from 'react-router-dom'
import '@mantine/core/styles.css';
import Signup from "./pages/Signup";
import * as Sentry from '@sentry/react';



function App() {

  return (
    <>
      <button
        onClick={() => {
          Sentry.captureException(new Error('Bugsink test error'));
        }}
      >
        Test Bugsink
      </button>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </>
  )
}

export default App
