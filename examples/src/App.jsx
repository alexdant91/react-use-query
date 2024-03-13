import { useEffect } from 'react'
import { useQuery, useQueryContext } from './hooks'

const InnerDiv = () => {
  const [data, setDate] = useQueryContext();
  const [products, setProducts] = useQueryContext("products");

  return (
    <pre>
        {products && JSON.stringify(products, null, 2)}
    </pre>
  )
}

const App = () => {
  const { data, error, loading, refresh } = useQuery("https://dummyjson.com/products", {
    name: "products",
    selector: "products",
    cacheTimeout: 5000,
    transform: (data) => {
      return data.filter((item) => item.id % 2 === 0);
    },
    pick: (key, value) => {
      if (typeof value === "string" || key === "images") return undefined;
      return value;
    },
    isDebuggerActivated: true
  });

  return (
    <>
      <InnerDiv />
    </>
  )
}

export default App
