import './App.css'
import Header from './components/Header'
import BrandMarquee from './components/BrandMarquee'
import Highlight from './components/Highlight'
import Contents from './components/Contents'
import Footer from './components/Footer'
import { useProducts, useCollaborations } from './hooks/useDirectusData'

function App() {
  const { data: items, highlights, loading } = useProducts()
  const { data: collabs } = useCollaborations()

  return (
    <>
      <div className="max-w-[900px] mx-auto px-5 bg-white rounded-[36px] shadow-[0_6px_18px_rgba(10,10,20,0.08)] overflow-hidden my-[60px] max-[480px]:w-screen max-[480px]:mx-[calc(50%-50vw)] max-[480px]:my-0 max-[480px]:rounded-none max-[480px]:px-0">
        <Header />
        <BrandMarquee brands={collabs} />
        <Highlight items={highlights} loading={loading} />
        <Contents items={items} loading={loading} />
        <Footer />
      </div>
    </>
  )
}

export default App
