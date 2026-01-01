import './App.css'
import Header from './components/Header'
import Highlight from './components/Highlight'
import Contents from './components/Contents'
import Footer from './components/Footer'
import NewYear2026 from './components/celebrations/NewYear2026'

function App() {
  return (
    <>
      <div className="max-w-[900px] mx-auto px-5 bg-white rounded-[36px] shadow-[0_6px_18px_rgba(10,10,20,0.08)] overflow-hidden my-[60px] max-[480px]:w-screen max-[480px]:mx-[calc(50%-50vw)] max-[480px]:my-0 max-[480px]:rounded-none max-[480px]:px-0">
        <Header />
        <Highlight />
        <Contents />
        <Footer />
      </div>
    </>
  )
}

export default App
