
// import { useState } from 'react';
// import axios from 'axios';

// const AddProductForm = ({ onProductAdded }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         tagline: '',
//         price: '',
//         stock: '',
//         category: 'earbuds',
//         discountPrice: '',
//         colors: [{ name: '', hex: '#000000' }],
//         features: [''],
//         description: '',
//         technicalSpecs: {
//             batteryLife: '',
//             connectivity: '',
//             noiseReduction: '',
//             waterResistance: ''
//         },
//         img: ['']
//     });

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         if (name.includes('.')) {
//             // Handle nested properties like technicalSpecs.batteryLife
//             const [parent, child] = name.split('.');
//             setFormData({
//                 ...formData,
//                 [parent]: {
//                     ...formData[parent],
//                     [child]: value
//                 }
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value
//             });
//         }
//     };

//     const handleColorChange = (index, field, value) => {
//         const updatedColors = [...formData.colors];
//         updatedColors[index] = {
//             ...updatedColors[index],
//             [field]: value
//         };
//         setFormData({
//             ...formData,
//             colors: updatedColors
//         });
//     };

//     const addColor = () => {
//         setFormData({
//             ...formData,
//             colors: [...formData.colors, { name: '', hex: '#000000' }]
//         });
//     };

//     const removeColor = (index) => {
//         const updatedColors = [...formData.colors];
//         updatedColors.splice(index, 1);
//         setFormData({
//             ...formData,
//             colors: updatedColors
//         });
//     };

//     const handleFeatureChange = (index, value) => {
//         const updatedFeatures = [...formData.features];
//         updatedFeatures[index] = value;
//         setFormData({
//             ...formData,
//             features: updatedFeatures
//         });
//     };

//     const addFeature = () => {
//         setFormData({
//             ...formData,
//             features: [...formData.features, '']
//         });
//     };

//     const removeFeature = (index) => {
//         const updatedFeatures = [...formData.features];
//         updatedFeatures.splice(index, 1);
//         setFormData({
//             ...formData,
//             features: updatedFeatures
//         });
//     };

//     const handleFileChange = (event) => {
//         const files = Array.from(event.target.files);
//         setSelectedFiles((prevState) => [...prevState, ...files]);
//     };

//     const handleRemoveImage = (index) => {
//         setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
//     };

//     const handleImageChange = (index, value) => {
//         const updatedImg = [...formData.img];
//         updatedImg[index] = value;
//         setFormData({
//             ...formData,
//             img: updatedImg
//         });
//     };

//     const addImage = () => {
//         setFormData({
//             ...formData,
//             img: [...formData.img, '']
//         });
//     };

//     const removeImage = (index) => {
//         const updatedImg = [...formData.img];
//         updatedImg.splice(index, 1);
//         setFormData({
//             ...formData,
//             img: updatedImg
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (selectedFiles.length === 0) {
//             toast.warning("Please add at least one product image");
//             return;
//         }
//         setIsSubmitting(true);
//         setError(null);

//         try {
//             // Convert string prices to numbers
//             const productData = {
//                 ...formData,
//                 price: parseFloat(formData.price),
//                 discountPrice: parseFloat(formData.discountPrice),
//                 stock: parseFloat(formData.stock),
//             };
//             const token = localStorage.getItem("token"); // Extract token safely
//             console.log(token)
//             if (!token) {
//                 console.error("🚨 No token found in localStorage!");
//                 toast.error("Authentication failed. Please log in again.");
//                 return;
//             }

//             console.log("🛠️ Token being sent:", token); // Debugging

//             const API_URL = import.meta.env.VITE_BACKEND_URL;
//             const response = await axios.post(`${API_URL}/admin/add-product`, productData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     },
//                     withCredentials: "include"
//                 }
//             );
//             console.log(response)

//             // Reset form
//             setFormData({
//                 name: '',
//                 tagline: '',
//                 price: '',
//                 discountPrice: '',
//                 stock: '',
//                 colors: [{ name: '', hex: '#000000' }],
//                 features: [''],
//                 description: '',
//                 technicalSpecs: {
//                     batteryLife: '',
//                     connectivity: '',
//                     noiseReduction: '',
//                     waterResistance: ''
//                 },
//                 img: ['']
//             });

//             // Notify parent component
//             if (onProductAdded) {
//                 onProductAdded(response.data);
//             }

//         } catch (err) {
//             console.error('Error creating product:', err);
//             setError(err.response?.data?.message || 'Failed to add product. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-6">Add New Product</h2>

//             {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Basic Info */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Tagline</label>
//                     <input
//                         type="text"
//                         name="tagline"
//                         value={formData.tagline}
//                         onChange={handleChange}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Price</label>
//                     <input
//                         type="number"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         min="0"
//                         step="0.01"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Discount Price</label>
//                     <input
//                         type="number"
//                         name="discountPrice"
//                         value={formData.discountPrice}
//                         onChange={handleChange}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         min="0"
//                         step="0.01"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Stock</label>
//                     <input
//                         type="number"
//                         name="stock"
//                         value={formData.stock}
//                         onChange={handleChange}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         min="0"
//                         step="0.01"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">category</label>
//                     <select
//                         name="stock"
//                         value={formData.category}
//                         onChange={handleChange}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                     >
//                         <option value="">Select a product</option>
//                         <option value="smartwatch">Smartwatch</option>
//                         <option value="earbuds">Earbuds</option>
//                         <option value="headphones">Headphones</option>
//                     </select>
//                 </div>

//             </div>

//             {/* Description */}
//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="4"
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                 ></textarea>
//             </div>

//             {/* Technical Specs */}
//             <div className="border-t border-gray-200 pt-4">
//                 <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Battery Life</label>
//                         <input
//                             type="text"
//                             name="technicalSpecs.batteryLife"
//                             value={formData.technicalSpecs.batteryLife}
//                             onChange={handleChange}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Connectivity</label>
//                         <input
//                             type="text"
//                             name="technicalSpecs.connectivity"
//                             value={formData.technicalSpecs.connectivity}
//                             onChange={handleChange}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Noise Reduction</label>
//                         <input
//                             type="text"
//                             name="technicalSpecs.noiseReduction"
//                             value={formData.technicalSpecs.noiseReduction}
//                             onChange={handleChange}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Water Resistance</label>
//                         <input
//                             type="text"
//                             name="technicalSpecs.waterResistance"
//                             value={formData.technicalSpecs.waterResistance}
//                             onChange={handleChange}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Colors */}
//             <div className="border-t border-gray-200 pt-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium">Colors</h3>
//                     <button
//                         type="button"
//                         onClick={addColor}
//                         className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                     >
//                         Add Color
//                     </button>
//                 </div>

//                 {formData.colors.map((color, index) => (
//                     <div key={index} className="flex items-center gap-4 mb-3">
//                         <div className="flex-1">
//                             <label className="block text-sm font-medium text-gray-700">Color Name</label>
//                             <input
//                                 type="text"
//                                 value={color.name}
//                                 onChange={(e) => handleColorChange(index, 'name', e.target.value)}
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                 required
//                             />
//                         </div>

//                         <div className="flex-1">
//                             <label className="block text-sm font-medium text-gray-700">Hex Color</label>
//                             <div className="flex items-center mt-1">
//                                 <input
//                                     type="color"
//                                     value={color.hex}
//                                     onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
//                                     className="h-10 w-10 rounded border border-gray-300"
//                                 />
//                                 <input
//                                     type="text"
//                                     value={color.hex}
//                                     onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
//                                     className="ml-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                                     pattern="^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => removeColor(index)}
//                             className="mt-6 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                             disabled={formData.colors.length <= 1}
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Features */}
//             <div className="border-t border-gray-200 pt-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium">Features</h3>
//                     <button
//                         type="button"
//                         onClick={addFeature}
//                         className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                     >
//                         Add Feature
//                     </button>
//                 </div>

//                 {formData.features.map((feature, index) => (
//                     <div key={index} className="flex items-center gap-4 mb-3">
//                         <input
//                             type="text"
//                             value={feature}
//                             onChange={(e) => handleFeatureChange(index, e.target.value)}
//                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         />

//                         <button
//                             type="button"
//                             onClick={() => removeFeature(index)}
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                             disabled={formData.features.length <= 1}
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Images */}
//             <div className="border-t border-gray-200 pt-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-medium">Images</h3>
//                     <button
//                         type="button"
//                         onClick={addImage}
//                         className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//                     >
//                         Add Image URL
//                     </button>
//                 </div>

//                 {formData.img.map((imageUrl, index) => (
//                     <div key={index} className="flex items-center gap-4 mb-3">
//                         <input
//                             type="text"
//                             value={imageUrl}
//                             onChange={(e) => handleImageChange(index, e.target.value)}
//                             placeholder="Image URL"
//                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                             required
//                         />

//                         <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                             disabled={formData.img.length <= 1}
//                         >
//                             Remove
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             <div className="pt-4">
//                 <button
//                     type="submit"
//                     className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? 'Adding Product...' : 'Add Product'}
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default AddProductForm;

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const AddProductForm = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        price: '',
        stock: '',
        category: 'earbuds',
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
        imgs: []
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState([]);

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

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        // Add files to the selectedFiles state
        setSelectedFiles((prevState) => [...prevState, ...files]);

        // Create preview URLs for the selected files
        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreview((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
    };

    const handleRemoveImage = (index) => {
        // Release object URL to avoid memory leaks
        URL.revokeObjectURL(imagePreview[index]);

        // Remove file and preview
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
        setImagePreview(imagePreview.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            toast.warning("Please add at least one product image");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Convert string prices to numbers
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                discountPrice: parseFloat(formData.discountPrice),
                stock: parseFloat(formData.stock),
            };
            console.log(productData)
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("🚨 No token found in localStorage!");
                toast.error("Authentication failed. Please log in again.");
                return;
            }

            // Create FormData object to send files
            const formDataToSend = new FormData();

            // Append all the product data
            formDataToSend.append('productData', JSON.stringify(productData));

            // Append each file with a unique key
            selectedFiles.forEach((file, index) => {
                formDataToSend.append('productImages', file);
            });
            console.log(formDataToSend)

            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.post(
                `${API_URL}/admin/add-product`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Important for file uploads
                    },
                    withCredentials: true
                }
            );

            toast.success("Product added successfully!");

            // Reset form
            setFormData({
                name: '',
                tagline: '',
                price: '',
                discountPrice: '',
                stock: '',
                category: 'earbuds',
                colors: [{ name: '', hex: '#000000' }],
                features: [''],
                description: '',
                technicalSpecs: {
                    batteryLife: '',
                    connectivity: '',
                    noiseReduction: '',
                    waterResistance: ''
                }
            });

            // Clear selected files and previews
            setSelectedFiles([]);
            imagePreview.forEach(url => URL.revokeObjectURL(url));
            setImagePreview([]);

            // Notify parent component
            if (onProductAdded) {
                onProductAdded(response.data);
            }

        } catch (err) {
            console.error('Error creating product:', err);
            setError(err.response?.data?.message || 'Failed to add product. Please try again.');
            toast.error(err.response?.data?.message || 'Failed to add product');
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="0"
                        step="0.01"
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
                        <option value="">Select a product</option>
                        <option value="smartwatch">Smartwatch</option>
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

            {/* Images - Now with file upload */}
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
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    {selectedFiles[index]?.name}
                                </p>
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
                    {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </button>
            </div>
        </form>
    );
};

export default AddProductForm;