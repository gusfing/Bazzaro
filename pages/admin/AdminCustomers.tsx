import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Mail } from 'lucide-react';

interface CustomerProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCustomers((data as any) || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div>Loading Customers...</div>;

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Registered Customers</h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-responsive-md">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th><strong>NAME</strong></th>
                    <th><strong>EMAIL</strong></th>
                    <th><strong>JOINED DATE</strong></th>
                    <th><strong>ACTION</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cust, i) => (
                    <tr key={cust.id}>
                      <td><strong>{i + 1}</strong></td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="w-space-no">{cust.full_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td>{cust.email}</td>
                      <td>{new Date(cust.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex">
                          <a href={`mailto:${cust.email}`} className="btn btn-primary shadow btn-xs sharp me-1">
                            <Mail size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan={5} className="text-center">No customers found.</td></tr>
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

export default AdminCustomers;
