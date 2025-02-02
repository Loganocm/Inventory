import React, { useState, useEffect } from 'react'; 
import './Dashboard.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    quantity: '',
    location: '',
  });
  const [editProduct, setEditProduct] = useState(null);
  const [newLocationName, setNewLocationName] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem('token'); 

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/locations', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setLocations(data);
          } else {
            console.error('Failed to fetch locations:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
      } else {
        console.error('No token found');
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedLocation) {
        const token = localStorage.getItem('token'); 

        if (token) {
          try {
            const url =
              selectedLocation === 'main'
                ? 'http://localhost:5000/api/products' 
                : `http://localhost:5000/api/products/location/${selectedLocation}`;

            const response = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setProducts(data);
            } else {
              console.error('Failed to fetch products:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        } else {
          console.error('No token found');
        }
      } else {
        setProducts([]); 
      }
    };

    fetchProducts();
  }, [selectedLocation]);

  const handleLocationSelect = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId === 'main' ? 'main' : locationId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category,
          quantity: newProduct.quantity,
          location: newProduct.location,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setProducts((prevProducts) => [...prevProducts, data]);
          setNewProduct({ name: '', price: '', category: '', quantity: '', location: '' });
        })
        .catch((error) => console.error('Error adding product:', error));
    } else {
      console.error('No token found');
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      location: product.location._id || '', // Set location correctly when editing
    });
  };
  
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    if (token) {
      fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category,
          quantity: newProduct.quantity,
          location: newProduct.location, // Ensure location is part of the update
        }),
      })
        .then((response) => response.json())
        .then((updatedProduct) => {
          setProducts(
            products.map((product) =>
              product._id === updatedProduct._id ? updatedProduct : product
            )
          );
          setEditProduct(null);
          setNewProduct({
            name: '',
            price: '',
            category: '',
            quantity: '',
            location: '', // Reset location after update
          });
        })
        .catch((error) => console.error('Error updating product:', error));
    } else {
      console.error('No token found');
    }
  };
  
  const handleCreateNewProduct = () => {
    setEditProduct(null);
    setNewProduct({ name: '', price: '', category: '', quantity: '', location: '' });
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const handleDeleteProduct = (productId) => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setProducts(products.filter((product) => product._id !== productId));
          } else {
            console.error('Failed to delete product:', response.statusText);
          }
        })
        .catch((error) => console.error('Error deleting product:', error));
    } else {
      console.error('No token found');
    }
  };

  const currentUserName = localStorage.getItem('username') || 'Guest';

  return (
    <div className="App">
      <div className="right-panel">
        <h2>Product List</h2>

        <select
          onChange={handleLocationSelect}
          value={selectedLocation || ''}
          className="location-dropdown"
        >
          <option value="">Select a Location</option>
          <option value="main">Main Location (All Products)</option>
          {locations.map((location) => (
            <option key={location._id} value={location._id}>
              {location.name}
            </option>
          ))}
        </select>

        <div className="product-list">
          {selectedLocation ? (
            products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-item">
                  <h3>{product.name}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Category: {product.category}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Location: {product.location.name}</p>
                  <button onClick={() => handleEditProduct(product)}>
                    Edit Product
                  </button>
                  <button onClick={() => handleDeleteProduct(product._id)}>
                    Delete Product
                  </button>
                </div>
              ))
            ) : (
              <p>No products available for this location.</p>
            )
          ) : (
            <p>Please select a location to view products.</p>
          )}
        </div>
      </div>

      <div className="left-panel">
        <div className="form-panel">
          <h2>{editProduct ? 'Edit Product' : 'Create New Product'}</h2>
          <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Product Price"
              required
            />
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              placeholder="Product Category"
              required
            />
            <input
              type="number"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleInputChange}
              placeholder="Product Quantity"
              required
            />
            <select
              name="location"
              value={newProduct.location} // Bind the location value to the state
              onChange={handleInputChange} // Handle updates to the location
              required
            >
              <option value="">Select a Location</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                </option>
              ))}
            </select>
            <button type="submit">
              {editProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
          {editProduct && (
            <button onClick={handleCreateNewProduct}>Create New Product</button>
          )}
        </div>

        <div className="add-location-panel">
          <h3>Add a New Location</h3>
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="New Location Name"
          />
          <button onClick={() => alert('Location added')}>Add</button>
        </div>
      </div>

      <div className="user-info">
        <div className="user-name">{currentUserName}</div>
        <button onClick={handleSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;