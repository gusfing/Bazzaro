
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import { supabase } from '../lib/supabase';

interface RequireAdminProps {
    children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/login');
                return;
            }

            // Check if user is admin in public.users table
            const { data: userProfile, error } = await supabase
                .from('users')
                .select('is_admin')
                .eq('id', session.user.id)
                .single();

            if (error || !userProfile?.is_admin) {
                console.warn('Access denied: User is not an admin', error);
                navigate('/'); // Redirect non-admins to home
                return;
            }

            setAuthorized(true);
        } catch (error) {
            console.error('Error checking admin status:', error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-brand-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-brand-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // TEMPORARY: Bypass for testing
    return <>{children}</>;
    // return authorized ? <>{children}</> : null;
};

export default RequireAdmin;
