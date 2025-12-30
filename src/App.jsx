import './App.css'
import Header from './components/Header'
import Highlight from './components/Highlight'
import Contents from './components/Contents'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <div className="app-card container">
        <Header />
        <Highlight />
        <Contents />
        <Footer />
      </div>
    </>
  )
}

export default App
