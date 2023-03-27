import React from 'react'
import { AppContextProvider } from './components/Calendar/AppStore'
import { Calendar } from './components/Calendar/Calendar'
import './App.css';

function App() {
  return (
    <div className="App">
        <AppContextProvider>
            <Calendar />
        </AppContextProvider>
    </div>
  );
}

export default App;
