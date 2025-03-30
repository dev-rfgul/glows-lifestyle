

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify'; // Add react-toastify for better notifications

// const INITIAL_PRODUCT_STATE = {
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     size: '',
//     SKU: '',
//     category: '',
//     tag: 'wallet', // Default value
// };

// const TAGS = [
//     { value: 'wallet', label: 'Wallet' },
//     { value: 'gadgets', label: 'Gadgets' },
//     { value: 'bags', label: 'Bags' },
// ];

// const ImageUploader = () => {
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);
//     const [products, setProducts] = useState([]);
//     const [isLoadingProducts, setIsLoadingProducts] = useState(false);

//     // Fetch products only when component mounts, not on every product change
//     const fetchProducts = useCallback(async () => {
//         setIsLoadingProducts(true);
//         try {
//             const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);
//             if (!response.ok) throw new Error('Failed to fetch products');
//             const data = await response.json();
//             setProducts(data);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//             toast.error("Failed to load products. Please try again later.");
//         } finally {
//             setIsLoadingProducts(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchProducts();
//     }, [fetchProducts]);

//     const handleChange = (e) => {
//         const { name, value, type } = e.target;
//         // Convert number inputs to numbers
//         const processedValue = type === 'number' ? parseFloat(value) : value;
//         setProduct({ ...product, [name]: processedValue });
//     };

//     const handleFileChange = (event) => {
//         const files = Array.from(event.target.files);
//         setSelectedFiles((prevState) => [...prevState, ...files]);
//     };

//     const handleRemoveImage = (index) => {
//         setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         if (selectedFiles.length === 0) {
//             toast.warning("Please add at least one product image");
//             return;
//         }

//         setLoading(true);
//         const formData = new FormData();

//         // Add all product fields to formData
//         Object.entries(product).forEach(([key, value]) => {
//             formData.append(key, value);
//         });

//         // Add all image files
//         selectedFiles.forEach((file) => formData.append('image', file));

//         try {
//             const token = JSON.parse(localStorage.getItem("user"))?.token; // Extract token safely
//             console.log(token)
//             if (!token) {
//                 console.error("🚨 No token found in localStorage!");
//                 toast.error("Authentication failed. Please log in again.");
//                 return;
//             }

//             console.log("🛠️ Token being sent:", token); // Debugging

//             const response = await axios.post(
//                 `${import.meta.env.VITE_BACKEND_URL}/admin/add-product`,
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                         Authorization: `Bearer ${token}` // Send token here
//                     },
//                     withCredentials: true
//                 }
//             );

//             if (response.data.message === "Product created successfully") {
//                 toast.success("Product added successfully!");
//                 setProduct(INITIAL_PRODUCT_STATE);
//                 setSelectedFiles([]);
//                 fetchProducts();
//             }
//         } catch (error) {
//             console.error("❌ Error submitting product:", error);
//             toast.error(error.response?.data?.message || "Failed to add product");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         const confirmDelete = window.confirm("Do you want to delete this product?");
//         if (!confirmDelete) return;

//         try {
//             const token = JSON.parse(localStorage.getItem("user"))?.token; // Extract token safely

//             if (!token) {
//                 console.error("🚨 No token found in localStorage!");
//                 toast.error("Authentication failed. Please log in again.");
//                 return;
//             }

//             console.log("🛠️ Token being sent:", token); // Debugging

//             const response = await axios.delete(
//                 `${import.meta.env.VITE_BACKEND_URL}/admin/delete-product/${id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // Send token in Authorization header
//                     },
//                     withCredentials: true,
//                 }
//             );

//             if (response.status === 200) {
//                 toast.success("Product deleted successfully");
//                 setProducts(products.filter(product => product._id !== id));
//             } else {
//                 toast.error("Failed to delete product");
//             }
//         } catch (error) {
//             console.error("❌ Error deleting product:", error);
//             toast.error(error.response?.data?.message || "An error occurred while deleting the product");
//         }
//     };


//     // Form input field component to reduce repetition
//     const FormField = ({ name, type = "text", required = true }) => (
//         <div>
//             <label className="block text-lg font-medium text-gray-700">
//                 {name.charAt(0).toUpperCase() + name.slice(1)}
//             </label>
//             <input
//                 type={type}
//                 name={name}
//                 value={product[name]}
//                 onChange={handleChange}
//                 placeholder={`Enter ${name}`}
//                 className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
//                 required={required}
//             />
//         </div>
//     );

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             {/* Add Product Form */}
//             <div className="bg-white p-8 rounded-lg shadow-lg mb-10">
//                 <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Add Product</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <FormField name="name" />
//                         <FormField name="price" type="number" />
//                         <FormField name="stock" type="number" />
//                         <FormField name="size" />
//                         <FormField name="SKU" />
//                         <FormField name="category" />

//                         {/* Tag Dropdown */}
//                         <div>
//                             <label className="block text-lg font-medium text-gray-700">Tag</label>
//                             <select
//                                 name="tag"
//                                 value={product.tag}
//                                 onChange={handleChange}
//                                 className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             >
//                                 {TAGS.map(tag => (
//                                     <option key={tag.value} value={tag.value}>
//                                         {tag.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Description Field - Full Width */}
//                     <div>
//                         <label className="block text-lg font-medium text-gray-700">Description</label>
//                         <textarea
//                             name="description"
//                             value={product.description}
//                             onChange={handleChange}
//                             placeholder="Enter product description"
//                             rows="4"
//                             className="mt-2 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     {/* Image Upload Section */}
//                     <div>
//                         <label className="block text-lg font-medium text-gray-700">Images</label>
//                         <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
//                             <input
//                                 type="file"
//                                 multiple
//                                 onChange={handleFileChange}
//                                 className="w-full"
//                                 accept="image/*"
//                             />
//                             <p className="text-sm text-gray-500 mt-2">
//                                 Drag and drop images or click to select files
//                             </p>
//                         </div>

//                         {selectedFiles.length > 0 && (
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
//                                 {selectedFiles.map((file, index) => (
//                                     <div key={index} className="relative group rounded-lg overflow-hidden">
//                                         <img
//                                             src={URL.createObjectURL(file)}
//                                             alt={`Image ${index + 1}`}
//                                             className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
//                                         />
//                                         <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                                             <button
//                                                 type="button"
//                                                 onClick={() => handleRemoveImage(index)}
//                                                 className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
//                                             >
//                                                 <FaTrash />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit Button */}
//                     <div className="mt-6 text-center">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
//                         >
//                             {loading ? (
//                                 <span className="flex items-center justify-center">
//                                     <FaSpinner className="animate-spin mr-2" /> Adding...
//                                 </span>
//                             ) : (
//                                 "Add Product"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             {/* Product List Section */}
//             <div className="mt-12">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold">Product List</h1>
//                     <button
//                         onClick={fetchProducts}
//                         className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center"
//                     >
//                         <span className={isLoadingProducts ? "animate-spin mr-2" : "mr-2"}>⟳</span> Refresh
//                     </button>
//                 </div>

//                 {isLoadingProducts ? (
//                     <div className="flex justify-center my-12">
//                         <FaSpinner className="animate-spin text-4xl text-blue-500" />
//                     </div>
//                 ) : products.length ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {products.map((product) => (
//                             <div
//                                 key={product._id}
//                                 className="border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300"
//                             >
//                                 <div className="relative overflow-hidden group">
//                                     <img
//                                         src={product.images[0]}
//                                         alt={product.name}
//                                         className="w-full h-48 object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
//                                     />
//                                     {product.discount > 0 && (
//                                         <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
//                                             -{product.discount}%
//                                         </div>
//                                     )}
//                                     {product.stock <= 5 && (
//                                         <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
//                                             Low Stock: {product.stock}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="p-4">
//                                     <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
//                                     <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
//                                     <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
//                                         <span className="capitalize bg-gray-100 px-2 py-1 rounded">{product.tag}</span>
//                                         <span>SKU: {product.SKU}</span>
//                                     </div>
//                                     <div className="mt-3 font-bold text-lg">${parseFloat(product.price).toFixed(2)}</div>
//                                     <div className="flex justify-between items-center mt-4 space-x-2">
//                                         <Link to={`/edit-product/${product._id}`} className="flex-1">
//                                             <button className="w-full bg-yellow-600 text-white py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-all flex items-center justify-center">
//                                                 <FaEdit className="mr-2" /> Edit
//                                             </button>
//                                         </Link>
//                                         <button
//                                             onClick={() => handleDelete(product._id)}
//                                             className="flex-1 bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition-all flex items-center justify-center"
//                                         >
//                                             <FaTrash className="mr-2" /> Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center p-12 bg-gray-50 rounded-xl">
//                         <p className="text-xl text-gray-600">No products available.</p>
//                         <p className="text-gray-500 mt-2">Add your first product using the form above.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ImageUploader;


// src/components/AddProductForm.jsx
import { useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        price: '',
        discountPrice: '',
        colors: [{ name: '', hex: '#000000' }],
        features: [''],
        description: '',
        technicalSpecs: {
            batteryLife: '',
            connectivity: '',
            noiseReduction: '',
            waterResistance: ''
        },
        img: ['']
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            // Handle nested properties like technicalSpecs.batteryLife
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleColorChange = (index, field, value) => {
        const updatedColors = [...formData.colors];
        updatedColors[index] = {
            ...updatedColors[index],
            [field]: value
        };
        setFormData({
            ...formData,
            colors: updatedColors
        });
    };

    const addColor = () => {
        setFormData({
            ...formData,
            colors: [...formData.colors, { name: '', hex: '#000000' }]
        });
    };

    const removeColor = (index) => {
        const updatedColors = [...formData.colors];
        updatedColors.splice(index, 1);
        setFormData({
            ...formData,
            colors: updatedColors
        });
    };

    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...formData.features];
        updatedFeatures[index] = value;
        setFormData({
            ...formData,
            features: updatedFeatures
        });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, '']
        });
    };

    const removeFeature = (index) => {
        const updatedFeatures = [...formData.features];
        updatedFeatures.splice(index, 1);
        setFormData({
            ...formData,
            features: updatedFeatures
        });
    };

    const handleImageChange = (index, value) => {
        const updatedImg = [...formData.img];
        updatedImg[index] = value;
        setFormData({
            ...formData,
            img: updatedImg
        });
    };

    const addImage = () => {
        setFormData({
            ...formData,
            img: [...formData.img, '']
        });
    };

    const removeImage = (index) => {
        const updatedImg = [...formData.img];
        updatedImg.splice(index, 1);
        setFormData({
            ...formData,
            img: updatedImg
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Convert string prices to numbers
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discountPrice: parseFloat(formData.discountPrice)
            };
            const token = localStorage.getItem("token"); // Extract token safely
            console.log(token)
            if (!token) {
                console.error("🚨 No token found in localStorage!");
                toast.error("Authentication failed. Please log in again.");
                return;
            }

            console.log("🛠️ Token being sent:", token); // Debugging

            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(`${API_URL}/admin/add-product`, productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: "include"
                }
            );
            console.log(response)

            // Reset form
            setFormData({
                name: '',
                tagline: '',
                price: '',
                discountPrice: '',
                colors: [{ name: '', hex: '#000000' }],
                features: [''],
                description: '',
                technicalSpecs: {
                    batteryLife: '',
                    connectivity: '',
                    noiseReduction: '',
                    waterResistance: ''
                },
                img: ['']
            });

            // Notify parent component
            if (onProductAdded) {
                onProductAdded(response.data);
            }

        } catch (err) {
            console.error('Error creating product:', err);
            setError(err.response?.data?.message || 'Failed to add product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Add New Product</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tagline</label>
                    <input
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                ></textarea>
            </div>

            {/* Technical Specs */}
            <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Battery Life</label>
                        <input
                            type="text"
                            name="technicalSpecs.batteryLife"
                            value={formData.technicalSpecs.batteryLife}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Connectivity</label>
                        <input
                            type="text"
                            name="technicalSpecs.connectivity"
                            value={formData.technicalSpecs.connectivity}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Noise Reduction</label>
                        <input
                            type="text"
                            name="technicalSpecs.noiseReduction"
                            value={formData.technicalSpecs.noiseReduction}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Water Resistance</label>
                        <input
                            type="text"
                            name="technicalSpecs.waterResistance"
                            value={formData.technicalSpecs.waterResistance}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Colors</h3>
                    <button
                        type="button"
                        onClick={addColor}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Add Color
                    </button>
                </div>

                {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Color Name</label>
                            <input
                                type="text"
                                value={color.name}
                                onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Hex Color</label>
                            <div className="flex items-center mt-1">
                                <input
                                    type="color"
                                    value={color.hex}
                                    onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                    className="h-10 w-10 rounded border border-gray-300"
                                />
                                <input
                                    type="text"
                                    value={color.hex}
                                    onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                                    className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    pattern="^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="mt-6 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            disabled={formData.colors.length <= 1}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Features</h3>
                    <button
                        type="button"
                        onClick={addFeature}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Add Feature
                    </button>
                </div>

                {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3">
                        <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            disabled={formData.features.length <= 1}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Images */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Images</h3>
                    <button
                        type="button"
                        onClick={addImage}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Add Image URL
                    </button>
                </div>

                {formData.img.map((imageUrl, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3">
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder="Image URL"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            disabled={formData.img.length <= 1}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </button>
            </div>
        </form>
    );
};

export default AddProductForm;