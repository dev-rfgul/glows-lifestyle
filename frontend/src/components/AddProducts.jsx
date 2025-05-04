


// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

// import axios from 'axios';

// const ProductManagement = () => {
//     // State for product list and loading
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         tagline: '',
//         price: '',
//         discountPrice: '',
//         stock: '',
//         category: '',
//         description: '',
//         technicalSpecs: {
//             batteryLife: '',
//             connectivity: '',
//             noiseReduction: '',
//             waterResistance: ''
//         },
//         colors: [{ name: '', hex: '#000000' }],
//         features: [''],
//         images: [] // To store existing image URLs
//     });

//     // UI state
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [imagePreview, setImagePreview] = useState([]);
//     const [imagesToRemove, setImagesToRemove] = useState([]);
//     const [editingProductId, setEditingProductId] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // Fetch products on component mount
//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const fetchProducts = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-products
//         `);
//             setProducts(response.data.products);
//             console.log(response);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Initialize form for adding new product
//     const handleAddNew = () => {
//         // Reset form to initial state
//         setFormData({
//             name: '',
//             tagline: '',
//             price: '',
//             discountPrice: '',
//             stock: '',
//             category: '',
//             description: '',
//             technicalSpecs: {
//                 batteryLife: '',
//                 connectivity: '',
//                 noiseReduction: '',
//                 waterResistance: ''
//             },
//             colors: [{ name: '', hex: '#000000' }],
//             features: [''],
//             images: []
//         });
//         setSelectedFiles([]);
//         setImagePreview([]);
//         setImagesToRemove([]);
//         setEditingProductId(null);
//         setError('');
//         setShowForm(true);
//         window.scrollTo(0, 0);
//     };

//     // Initialize form for editing existing product
//     const handleEdit = (product) => {
//         // Format the product data for the form
//         const productData = {
//             name: product.name || '',
//             tagline: product.tagline || '',
//             price: product.price || '',
//             discountPrice: product.discountPrice || '',
//             stock: product.stock || '',
//             category: product.category || '',
//             description: product.description || '',
//             technicalSpecs: product.technicalSpecs || {
//                 batteryLife: '',
//                 connectivity: '',
//                 noiseReduction: '',
//                 waterResistance: ''
//             },
//             colors: product.colors?.length > 0
//                 ? product.colors.map(color => {
//                     return typeof color === 'object'
//                         ? color
//                         : { name: color, hex: '#000000' }
//                 })
//                 : [{ name: '', hex: '#000000' }],
//             features: product.features?.length > 0
//                 ? product.features
//                 : [''],
//             images: product.img || product.images || []
//         };

//         setFormData(productData);
//         setEditingProductId(product._id);
//         setSelectedFiles([]);

//         // Set image previews
//         const images = product.img || product.images || [];
//         setImagePreview([...images]);
//         setImagesToRemove([]);
//         setError('');
//         setShowForm(true);
//         window.scrollTo(0, 0);
//     };

//     // Handle form cancellation
//     const handleCancel = () => {
//         setShowForm(false);
//         setEditingProductId(null);
//         setError('');
//     };

//     // Handle form field changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name.includes('.')) {
//             const [parent, child] = name.split('.');
//             setFormData(prev => ({
//                 ...prev,
//                 [parent]: {
//                     ...prev[parent],
//                     [child]: value
//                 }
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     // Handle color related functions
//     const addColor = () => {
//         setFormData(prev => ({
//             ...prev,
//             colors: [...prev.colors, { name: '', hex: '#000000' }]
//         }));
//     };

//     const removeColor = (index) => {
//         setFormData(prev => ({
//             ...prev,
//             colors: prev.colors.filter((_, i) => i !== index)
//         }));
//     };

//     const handleColorChange = (index, field, value) => {
//         setFormData(prev => {
//             const updatedColors = [...prev.colors];
//             updatedColors[index] = { ...updatedColors[index], [field]: value };
//             return { ...prev, colors: updatedColors };
//         });
//     };

//     // Handle feature related functions
//     const addFeature = () => {
//         setFormData(prev => ({
//             ...prev,
//             features: [...prev.features, '']
//         }));
//     };

//     const removeFeature = (index) => {
//         setFormData(prev => ({
//             ...prev,
//             features: prev.features.filter((_, i) => i !== index)
//         }));
//     };

//     const handleFeatureChange = (index, value) => {
//         setFormData(prev => {
//             const updatedFeatures = [...prev.features];
//             updatedFeatures[index] = value;
//             return { ...prev, features: updatedFeatures };
//         });
//     };

//     // Handle file uploads
//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length === 0) return;

//         // Create preview URLs for the selected files
//         const newPreviews = files.map(file => URL.createObjectURL(file));

//         setSelectedFiles(prev => [...prev, ...files]);
//         setImagePreview(prev => [...prev, ...newPreviews]);
//     };

//     const handleRemoveImage = (index) => {
//         // If removing an existing image (not a new file)
//         if (index < formData.images.length) {
//             setImagesToRemove(prev => [...prev, formData.images[index]]);

//             // Remove from formData.images
//             setFormData(prev => ({
//                 ...prev,
//                 images: prev.images.filter((_, i) => i !== index)
//             }));
//         } else {
//             // Calculate the index in the selectedFiles array
//             const fileIndex = index - formData.images.length;

//             // Remove from selectedFiles
//             setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
//         }

//         // Remove the preview
//         setImagePreview(prev => prev.filter((_, i) => i !== index));
//     };

//     // Handle form submission (add or update)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsSubmitting(true);

//         try {
//             const productFormData = new FormData();

//             // Build the complete product object
//             const productData = {
//                 name: formData.name,
//                 description: formData.description,
//                 price: formData.price,
//                 stock: formData.stock,
//                 category: formData.category,
//                 tagline: formData.tagline || '',
//                 discountPrice: formData.discountPrice || '',
//                 technicalSpecs: formData.technicalSpecs || {},
//                 colors: (formData.colors || []).map(color => ({
//                     name: color.name,
//                     hex: color.hex
//                 })),

//                 features: formData.features || [],
//                 images: formData.images || [],
//             };

//             // Append productData as a JSON string
//             productFormData.append('productData', JSON.stringify(productData));

//             // Append image files (IMPORTANT: key must match multer field name)
//             (selectedFiles || []).forEach(file => {
//                 productFormData.append('productImages', file);
//             });

//             // If any images to remove
//             if (imagesToRemove?.length > 0) {
//                 productFormData.append('imagesToRemove', JSON.stringify(imagesToRemove));
//             }

//             const token = localStorage.getItem("token");
//             if (!token) {
//                 toast.error("Authentication failed. Please log in again.");
//                 setIsSubmitting(false);
//                 return;
//             }

//             if (editingProductId) {
//                 await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-product/${editingProductId}`, productFormData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                     withCredentials: true
//                 });
//                 toast.success('Product updated!');
//             } else {
//                 await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-product`, productFormData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'multipart/form-data',
//                     },
//                     withCredentials: true
//                 });
//                 toast.success('Product added!');
//             }

//             // Reset form
//             setShowForm(false);
//             setEditingProductId(null);
//             await fetchProducts();

//         } catch (err) {
//             console.error(err);
//             setError(err?.response?.data?.message || err.message || 'An error occurred');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };


//     // Handle product deletion
//     const deleteProduct = async (productId) => {
//         if (!window.confirm('Are you sure you want to delete this product?')) return;

//         try {
//             await axios.delete(`/api/delete-product/${productId}`);
//             await fetchProducts();
//         } catch (error) {
//             console.error('Error deleting product:', error);
//             alert('Error deleting product. Please try again.');
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">Product Management</h1>
//                 {!showForm && (
//                     <button
//                         onClick={handleAddNew}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                     >
//                         Add New Product
//                     </button>
//                 )}
//                 {showForm && (
//                     <button
//                         onClick={handleCancel}
//                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                     >
//                         Cancel
//                     </button>
//                 )}
//             </div>

//             {showForm && (
//                 <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mb-8">
//                     <h2 className="text-xl font-bold mb-6">{editingProductId ? 'Update Product' : 'Add New Product'}</h2>

//                     {error && (
//                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                             {error}
//                         </div>
//                     )}

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Basic Info */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Name</label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Tagline</label>
//                             <input
//                                 type="text"
//                                 name="tagline"
//                                 value={formData.tagline}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Price</label>
//                             <input
//                                 type="number"
//                                 name="price"
//                                 value={formData.price}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 min="0"
//                                 step="0.01"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Discount Price</label>
//                             <input
//                                 type="number"
//                                 name="discountPrice"
//                                 value={formData.discountPrice}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 min="0"
//                                 step="0.01"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Stock</label>
//                             <input
//                                 type="number"
//                                 name="stock"
//                                 value={formData.stock}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 min="0"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Category</label>
//                             <select
//                                 name="category"
//                                 value={formData.category}
//                                 onChange={handleChange}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 required
//                             >
//                                 <option value="">Select a category</option>
//                                 <option value="smartwatches">Smartwatch</option>
//                                 <option value="earbuds">Earbuds</option>
//                                 <option value="headphones">Headphones</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Description</label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             rows="4"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         ></textarea>
//                     </div>

//                     {/* Technical Specs */}
//                     <div className="border-t border-gray-200 pt-4">
//                         <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Battery Life</label>
//                                 <input
//                                     type="text"
//                                     name="technicalSpecs.batteryLife"
//                                     value={formData.technicalSpecs.batteryLife}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Connectivity</label>
//                                 <input
//                                     type="text"
//                                     name="technicalSpecs.connectivity"
//                                     value={formData.technicalSpecs.connectivity}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Noise Reduction</label>
//                                 <input
//                                     type="text"
//                                     name="technicalSpecs.noiseReduction"
//                                     value={formData.technicalSpecs.noiseReduction}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Water Resistance</label>
//                                 <input
//                                     type="text"
//                                     name="technicalSpecs.waterResistance"
//                                     value={formData.technicalSpecs.waterResistance}
//                                     onChange={handleChange}
//                                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Colors */}
//                     <div className="border-t border-gray-200 pt-4">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-medium">Colors</h3>
//                             <button
//                                 type="button"
//                                 onClick={addColor}
//                                 className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                             >
//                                 Add Color
//                             </button>
//                         </div>

//                         {formData.colors.map((color, index) => (
//                             <div key={index} className="flex items-center gap-4 mb-3">
//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-700">Color Name</label>
//                                     <input
//                                         type="text"
//                                         value={color.name}
//                                         onChange={(e) => handleColorChange(index, 'name', e.target.value)}
//                                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="flex-1">
//                                     <label className="block text-sm font-medium text-gray-700">Hex Color</label>
//                                     <div className="flex items-center mt-1">
//                                         <input
//                                             type="color"
//                                             value={color.hex}
//                                             onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
//                                             className="h-10 w-10 rounded border border-gray-300"
//                                         />
//                                         <input
//                                             type="text"
//                                             value={color.hex}
//                                             onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
//                                             className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                             pattern="^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <button
//                                     type="button"
//                                     onClick={() => removeColor(index)}
//                                     className="mt-6 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                                     disabled={formData.colors.length <= 1}
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Features */}
//                     <div className="border-t border-gray-200 pt-4">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-medium">Features</h3>
//                             <button
//                                 type="button"
//                                 onClick={addFeature}
//                                 className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                             >
//                                 Add Feature
//                             </button>
//                         </div>

//                         {formData.features.map((feature, index) => (
//                             <div key={index} className="flex items-center gap-4 mb-3">
//                                 <input
//                                     type="text"
//                                     value={feature}
//                                     onChange={(e) => handleFeatureChange(index, e.target.value)}
//                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                     required
//                                 />

//                                 <button
//                                     type="button"
//                                     onClick={() => removeFeature(index)}
//                                     className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                                     disabled={formData.features.length <= 1}
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Images */}
//                     <div className="border-t border-gray-200 pt-4">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg font-medium">Product Images</h3>
//                             <label
//                                 htmlFor="imgs"
//                                 className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
//                             >
//                                 Upload Images
//                             </label>
//                             <input
//                                 id="imgs"
//                                 name='productImages'
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                             />
//                         </div>

//                         {/* Image preview section */}
//                         {imagePreview.length > 0 && (
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                                 {imagePreview.map((src, index) => (
//                                     <div key={index} className="relative">
//                                         <img
//                                             src={src}
//                                             alt={`Product preview ${index + 1}`}
//                                             className="h-32 w-full object-cover rounded-md"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={() => handleRemoveImage(index)}
//                                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//                                         >
//                                             ×
//                                         </button>
//                                         {index < formData.images.length ? (
//                                             <p className="text-xs text-gray-500 mt-1 truncate">Existing image</p>
//                                         ) : (
//                                             <p className="text-xs text-gray-500 mt-1 truncate">
//                                                 {selectedFiles[index - formData.images.length]?.name}
//                                             </p>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {imagePreview.length === 0 && (
//                             <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md">
//                                 <p className="text-gray-500">No images selected. Click "Upload Images" to add product photos.</p>
//                             </div>
//                         )}
//                     </div>

//                     <div className="pt-4">
//                         <button
//                             type="submit"
//                             className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting
//                                 ? (editingProductId ? 'Updating Product...' : 'Adding Product...')
//                                 : (editingProductId ? 'Update Product' : 'Add Product')}
//                         </button>
//                     </div>
//                 </form>
//             )}

//             {/* Product List */}
//             <div className="mt-8">
//                 <h2 className="text-xl font-semibold mb-4">Product List</h2>

//                 {loading ? (
//                     <p className="text-center py-4">Loading products...</p>
//                 ) : products.length === 0 ? (
//                     <p className="text-center py-4">No products found.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                         {products.map((product) => (
//                             <div
//                                 key={product._id}
//                                 className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition duration-300"
//                             >
//                                 <img
//                                     src={product.img?.[0] || product.images?.[0] || '/placeholder.png'}
//                                     alt={product.name}
//                                     className="w-full h-48 object-cover"
//                                 />
//                                 <div className="p-4">
//                                     <h1 className="text-lg font-semibold text-gray-800">{product.name}</h1>
//                                     <p className="text-sm text-gray-500 mb-2">{product.category}</p>
//                                     <p className="text-sm font-medium text-gray-900 mb-4">${product.price}</p>
//                                     <div className="flex justify-between">
//                                         <button
//                                             onClick={() => handleEdit(product)}
//                                             className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => deleteProduct(product._id)}
//                                             className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProductManagement;


import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications
import axios from 'axios';

const ProductManagement = () => {
    // State for product list and loading
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        price: '',
        discountPrice: '',
        stock: '',
        category: '',
        description: '',
        technicalSpecs: {
            batteryLife: '',
            connectivity: '',
            noiseReduction: '',
            waterResistance: ''
        },
        colors: [{ name: '', hex: '#000000' }],
        features: [''],
        images: [] // To store existing image URLs
    });

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [imagesToRemove, setImagesToRemove] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/get-products`);
            setProducts(response.data.products);
            console.log("Products fetched:", response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Initialize form for adding new product
    const handleAddNew = () => {
        // Reset form to initial state
        setFormData({
            name: '',
            tagline: '',
            price: '',
            discountPrice: '',
            stock: '',
            category: '',
            description: '',
            technicalSpecs: {
                batteryLife: '',
                connectivity: '',
                noiseReduction: '',
                waterResistance: ''
            },
            colors: [{ name: '', hex: '#000000' }],
            features: [''],
            images: []
        });
        setSelectedFiles([]);
        setImagePreview([]);
        setImagesToRemove([]);
        setEditingProductId(null);
        setError('');
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Initialize form for editing existing product
    const handleEdit = (product) => {
        // Format the product data for the form
        const productData = {
            name: product.name || '',
            tagline: product.tagline || '',
            price: product.price || '',
            discountPrice: product.discountPrice || '',
            stock: product.stock || '',
            category: product.category || '',
            description: product.description || '',
            technicalSpecs: product.technicalSpecs || {
                batteryLife: '',
                connectivity: '',
                noiseReduction: '',
                waterResistance: ''
            },
            colors: product.colors?.length > 0
                ? product.colors.map(color => {
                    return typeof color === 'object'
                        ? color
                        : { name: color, hex: '#000000' }
                })
                : [{ name: '', hex: '#000000' }],
            features: product.features?.length > 0
                ? product.features
                : [''],
            images: product.img || product.images || []
        };

        setFormData(productData);
        setEditingProductId(product._id);
        setSelectedFiles([]);

        // Set image previews
        const images = product.img || product.images || [];
        setImagePreview([...images]);
        setImagesToRemove([]);
        setError('');
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    // Handle form cancellation
    const handleCancel = () => {
        setShowForm(false);
        setEditingProductId(null);
        setError('');
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle color related functions
    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000' }]
        }));
    };

    const removeColor = (index) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const handleColorChange = (index, field, value) => {
        setFormData(prev => {
            const updatedColors = [...prev.colors];
            updatedColors[index] = { ...updatedColors[index], [field]: value };
            return { ...prev, colors: updatedColors };
        });
    };

    // Handle feature related functions
    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index, value) => {
        setFormData(prev => {
            const updatedFeatures = [...prev.features];
            updatedFeatures[index] = value;
            return { ...prev, features: updatedFeatures };
        });
    };

    // Handle file uploads
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Create preview URLs for the selected files
        const newPreviews = files.map(file => URL.createObjectURL(file));

        setSelectedFiles(prev => [...prev, ...files]);
        setImagePreview(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        // If removing an existing image (not a new file)
        if (index < formData.images.length) {
            setImagesToRemove(prev => [...prev, formData.images[index]]);

            // Remove from formData.images
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        } else {
            // Calculate the index in the selectedFiles array
            const fileIndex = index - formData.images.length;

            // Remove from selectedFiles
            setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }

        // Remove the preview
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    // Handle form submission (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const productFormData = new FormData();

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                tagline: formData.tagline || '',
                discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
                technicalSpecs: formData.technicalSpecs || {},
                color: formData.colors.map(color => ({
                    name: color.name,  // Name of the color
                    hex: color.hex     // Hex value of the color (make sure it's passed here)
                })),
                features: formData.features.filter(feature => feature.trim() !== '') || [],
            };

            if (editingProductId) {
                productData._id = editingProductId;
            }

            productFormData.append('productData', JSON.stringify(productData));

            // Existing images to keep
            if (formData.images?.length > 0) {
                const imagesToKeep = formData.images.filter(img => !imagesToRemove.includes(img));
                productFormData.append('existingImages', JSON.stringify(imagesToKeep));
            }

            // New uploaded images
            if (selectedFiles?.length > 0) {
                selectedFiles.forEach(file => {
                    productFormData.append('images', file); // must match multer field name
                });
            }

            if (imagesToRemove?.length > 0) {
                productFormData.append('imagesToRemove', JSON.stringify(imagesToRemove));
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication failed. Please log in again.');
                setIsSubmitting(false);
                return;
            }

            console.log(productFormData)
            const url = editingProductId
                ? `${import.meta.env.VITE_BACKEND_URL}/admin/edit-product/${editingProductId}`
                : `${import.meta.env.VITE_BACKEND_URL}/admin/add-product`;
            const response = await axios.post(url, productFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            toast.success(editingProductId ? 'Product updated!' : 'Product added!');
            setShowForm(false);
            setEditingProductId(null);
            await fetchProducts();
        } catch (err) {
            console.error('Error details:', err);
            console.error('Response data:', err.response?.data);
            setError(err?.response?.data?.message || err.message || 'An error occurred');
            toast.error(err?.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Handle product deletion
    const deleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication failed. Please log in again.");
                return;
            }

            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            toast.success('Product deleted successfully!');
            await fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error?.response?.data?.message || 'Error deleting product. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Add New Product
                    </button>
                )}
                {showForm && (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-6">{editingProductId ? 'Update Product' : 'Add New Product'}</h2>

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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="smartwatches">Smartwatch</option>
                                <option value="earbuds">Earbuds</option>
                                <option value="headphones">Headphones</option>
                            </select>
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
                            <h3 className="text-lg font-medium">Product Images</h3>
                            <label
                                htmlFor="imgs"
                                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                            >
                                Upload Images
                            </label>
                            <input
                                id="imgs"
                                name='productImages'
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {/* Image preview section */}
                        {imagePreview.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {imagePreview.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={src}
                                            alt={`Product preview ${index + 1}`}
                                            className="h-32 w-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                        {index < formData.images.length ? (
                                            <p className="text-xs text-gray-500 mt-1 truncate">Existing image</p>
                                        ) : (
                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                {selectedFiles[index - formData.images.length]?.name}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {imagePreview.length === 0 && (
                            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md">
                                <p className="text-gray-500">No images selected. Click "Upload Images" to add product photos.</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (editingProductId ? 'Updating Product...' : 'Adding Product...')
                                : (editingProductId ? 'Update Product' : 'Add Product')}
                        </button>
                    </div>
                </form>
            )}

            {/* Product List */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Product List</h2>

                {loading ? (
                    <p className="text-center py-4">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="text-center py-4">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition duration-300"
                            >
                                <img
                                    src={product.img?.[0] || product.images?.[0] || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h1 className="text-lg font-semibold text-gray-800">{product.name}</h1>
                                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                    <p className="text-sm font-medium text-gray-900 mb-4">${product.price}</p>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;