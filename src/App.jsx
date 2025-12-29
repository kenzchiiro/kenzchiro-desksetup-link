import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Highlight from './components/Highlight'
import Contents from './components/Contents'

function App() {
  return (
    <>
      <div className="app-card container">
        <Header />
        <Highlight />
        <Contents />
      </div>
    </>
  )
}

export default App
