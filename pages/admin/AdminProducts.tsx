import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../../lib/productsService';
import { Product } from '../../types';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Plus, Star } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Product List</h4>
            <Link to="/admin/products/add" className="btn btn-primary btn-sm">
              <Plus size={16} className="me-1" /> Add Product
            </Link>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
              <table id="productlist" className="display table" style={{ minWidth: '845px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>
                      <div className="form-check custom-checkbox checkbox-primary me-3">
                        <input type="checkbox" className="form-check-input" id="checkAll" />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                      </div>
                    </th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="form-check custom-checkbox checkbox-primary me-3">
                          <input type="checkbox" className="form-check-input" id={`check-${product.id}`} />
                          <label className="form-check-label" htmlFor={`check-${product.id}`}></label>
                        </div>
                      </td>
                      <td style={{ width: '30%' }}>
                        <div className="d-flex align-items-center">
                          {product.image_url ? (
                            <img src={product.image_url} className="rounded-lg me-2" width="40" height="40" style={{ objectFit: 'cover' }} alt={product.title} />
                          ) : (
                            <div className="rounded-lg me-2 d-flex align-items-center justify-content-center bg-light" style={{ width: 40, height: 40 }}>
                              <span className="text-muted text-xs">IMG</span>
                            </div>
                          )}
                          <div>
                            <h6 className="w-space-no mb-0 fs-14 font-w600">{product.title}</h6>
                            <small className="d-block text-muted">{product.slug}</small>
                          </div>
                        </div>
                      </td>
                      <td>{product.category_id || 'N/A'}</td>
                      <td>${product.base_price.toFixed(2)}</td>
                      <td>
                        {product.is_active ?
                          <span className="badge badge-sm badge-success light">Active</span> :
                          <span className="badge badge-sm badge-danger light">Inactive</span>
                        }
                      </td>
                      <td>
                        <ul className="d-flex align-items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <li key={star}>
                              <Star
                                size={14}
                                className={star <= (product.rating || 0) ? "text-warning fill-warning" : "text-muted"}
                                fill={star <= (product.rating || 0) ? "currentColor" : "none"}
                              />
                            </li>
                          ))}
                          <li className="ms-2 text-muted text-xs">({product.reviews_count || 0})</li>
                        </ul>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end">
                          <Link to={`/admin/products/edit/${product.id}`} className="btn btn-primary shadow btn-xs sharp me-1">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="btn btn-danger shadow btn-xs sharp">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
