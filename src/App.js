import React, { useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

import { Registration } from './Components/Registration/Registration';

function App() {
  useEffect(() => { document.title = 'Check Health Data'; }, []);
  return (
    <div>
      <Registration></Registration>
    </div>
  );
}

export default App;