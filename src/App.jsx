import { useState } from 'react'
import './App.css'

// Imports redux
import { Provider } from 'react-redux';
import { persistStore, persistReducer} from 'redux-persist';
import { PersistGate} from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {injectStore} from '../api/axios';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <p>Hello</p>
      </div>
      
    </>
  )
}

export default App
