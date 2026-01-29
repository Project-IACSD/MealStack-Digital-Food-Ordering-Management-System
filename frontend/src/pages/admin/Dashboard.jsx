import { useEffect, useState } from 'react';
import AdminService from '../../services/admin.service';

const AdminDashboard = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const total = await AdminService.getTotalStudents();
            setTotalStudents(total);

            try {
                const dashboard = await AdminService.getDashboard();
                setDashboardData(dashboard);
            } catch (e) {
                // Ignore if just a string check
                setDashboardData("Admin System Active");
            }
        } catch (error) {
            console.error("Error loading admin data", error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div className="card">
                    <h3>Total Students</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {totalStudents}
                    </p>
                </div>
                {/* Add more cards provided by getDashboard */}
                {dashboardData && (
                    <div className="card">
                        <h3>System Status</h3>
                        <p>Active</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
