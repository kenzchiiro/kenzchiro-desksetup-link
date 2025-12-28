import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Contents from './components/Contents'

function App() {
  return (
    <>
      <div className="app-card container">
        <Header />
        <Contents />
      </div>
    </>
  )
}

export default App
