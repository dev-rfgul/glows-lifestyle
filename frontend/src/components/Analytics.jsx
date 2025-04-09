import React ,{useState,useEffect}from 'react'

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setData(data.products);
                setError(null);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products");
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>

            <h1>Analytics</h1>
            <p>Analytics page</p>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && data.length === 0 && <p>No products found</p>}

            {!loading && !error && data.length > 0 && (
                <div>
                    <h2>Products</h2>
                    <ul>
                        {data.map((product) => (
                            <li key={product.id}>
                                <h3>{product.name}</h3>
                                <p>{product.visitCount}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}  
        </div>

    )
}

export default Analytics