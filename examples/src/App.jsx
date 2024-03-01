import { useEffect } from 'react'
import { useQuery } from '../../'

import './App.css'

function App() {
  const { data, error, loading, refresh } = useQuery("https://dummyjson.com/products", {
    selector: "products",
  });

  useEffect(() => {
    console.log(data);
  }, [data])

  return (
    <>
      <pre>
        {data && JSON.stringify(data, null, 2)}
      </pre>
    </>
  )
}

export default App
