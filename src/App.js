import { useState, useRef, useEffect } from "react"
import ContentLoader from "react-content-loader"

const AutocompleteLoader = () => (
  <ContentLoader
    speed={2}
    width={500}
    height={60}
    viewBox="0 0 500 60"
    backgroundColor="#f3f3f3"
    foregroundColor="#dedede"
  >
    <rect x="203" y="22" rx="0" ry="0" width="4" height="3" />
    <rect x="15" y="10" rx="0" ry="0" width="71" height="40" />
    <rect x="96" y="20" rx="0" ry="0" width="169" height="8" />
    <rect x="96" y="35" rx="0" ry="0" width="92" height="6" />
  </ContentLoader>
)

function App() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef()

  const isTyping = search.replace(/\s+/, '').length > 0;

  useEffect(() => {
    if (isTyping) {
      setLoading(true)
      const getData = setTimeout(() => {
        fetch(`https://frontendaily.com/search.php?query=${search}`)
          .then(res => res.json())
          .then(data => {
            setResult(data.length > 0 ? data : false)
            setLoading(false)
          })
      }, 500)
      return () => {
        clearTimeout(getData)
        setLoading(false)
      }
    } else {
      setResult(false)
    }





  }, [search])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearch('')
    }
  }

  const getResultItem = (item) => {
    window.location.href = item.url;
  }

  return (
    <>
      <div className="search" ref={searchRef}>
        <input type="text" value={search} className={isTyping ? 'typing' : null} placeholder="Look for something..." onChange={(e) => setSearch(e.target.value)} />
        {isTyping && (
          <div className="search-result">
            {result && loading === false && result.map(item => (
              <div onClick={() => getResultItem(item)} key={item.id} className="search-result-item" alt="">
                <img src={item.image} alt="" />
                <div>
                  <div className="title">{item.title}</div>
                  <div className="date">{item.date}</div>
                </div>
              </div>
            ))}
            {loading && new Array(3).fill().map(() => <AutocompleteLoader />)}
            {!result && loading === false && (
              <div className="result-not-found">
                "{search}" no search found for
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}

export default App;
