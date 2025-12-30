import './App.css'
import Header from './components/Header'
import Highlight from './components/Highlight'
import Contents from './components/Contents'
import Footer from './components/Footer'
import NewYear2026 from './components/celebrations/NewYear2026'

function App() {
  return (
    <>
      <NewYear2026 />
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
