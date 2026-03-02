import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex bg-[#FAFAFA] min-h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex bg-[#FAFAFA] min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
