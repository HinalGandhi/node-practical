import { useQuery } from "@tanstack/react-query";

interface productType {
  description: string;
  from: string;
  id: number;
  image: string;
  nutrients: string;
  organic: boolean;
  price: string;
  productName: string;
  quantity: string;
}

function App() {
  const { data, isFetching, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:8000/api");
      return res.json();
    },
  });

  if (isError) return null;

  return (
    <div className="App">
      {isFetching ? (
        <>Loading...</>
      ) : (
        data.map((e: productType) => (
          <div key={e.id}>
            <h3>Name : {e.productName}</h3>
            <h5>From : {e.from}</h5>
            <>
              <span>{e.image}</span>
              <span>{e.description}</span>
              <p>Nutrients : {e.nutrients}</p>
              <p>Qauntity : {e.quantity}</p>
            </>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
