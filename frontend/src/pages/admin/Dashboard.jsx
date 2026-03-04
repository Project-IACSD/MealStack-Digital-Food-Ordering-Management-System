import { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import OrderService from '../../services/OrderService';

const AdminDashboard = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [total, pending, completed] = await Promise.all([
                AdminService.getTotalStudents(),
                OrderService.getPendingOrders(),
                OrderService.getCompletedOrders()
            ]);
            setTotalStudents(total);
            setPendingOrders(Array.isArray(pending) ? pending : []);
            setCompletedOrders(Array.isArray(completed) ? completed : []);
        } catch (error) {
            // silently handle dashboard load error
        } finally {
            setLoading(false);
        }
    };

    // Calculate today's revenue from completed orders placed today
    const today = new Date().toDateString();
    const todaysRevenue = completedOrders
        .filter(o => new Date(o.time).toDateString() === today)
        .reduce((sum, o) => sum + (o.amount || 0), 0);

    const pendingToday = pendingOrders.filter(
        o => new Date(o.time).toDateString() === today
    ).length;

    const cards = [
        {
            label: 'Total Students',
            value: loading ? '...' : totalStudents,
            icon: '🧑‍🎓',
            color: '#0d6efd',
            light: '#e7f0ff',
        },
        {
            label: 'Pending Orders',
            value: loading ? '...' : pendingOrders.length,
            sub: `${pendingToday} today`,
            icon: '⏳',
            color: '#fd7e14',
            light: '#fff3e0',
        },
        {
            label: 'Completed Orders',
            value: loading ? '...' : completedOrders.length,
            icon: '✅',
            color: '#198754',
            light: '#e8f5e9',
        },
        {
            label: "Today's Revenue",
            value: loading ? '...' : `₹${todaysRevenue.toFixed(2)}`,
            icon: '💰',
            color: '#6f42c1',
            light: '#f0ebff',
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '8px', fontWeight: 700 }}>Admin Dashboard</h2>
            <p style={{ color: '#6c757d', marginBottom: '28px' }}>
                Welcome back! Here's an overview of the system.
            </p>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gap: '20px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                marginBottom: '32px'
            }}>
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="card shadow-sm"
                        style={{
                            borderRadius: '12px',
                            borderLeft: `5px solid ${card.color}`,
                            backgroundColor: card.light,
                            padding: '20px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {card.label}
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: card.color, margin: 0, lineHeight: 1.2 }}>
                                    {card.value}
                                </p>
                                {card.sub && (
                                    <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>{card.sub}</p>
                                )}
                            </div>
                            <span style={{ fontSize: '2.2rem' }}>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <h5 style={{ fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a href="/admin/orders/pending" className="btn btn-warning" style={{ fontWeight: 600 }}>
                    ⏳ View Pending Orders
                </a>
                <a href="/admin/orders/completed" className="btn btn-success" style={{ fontWeight: 600 }}>
                    ✅ View Completed Orders
                </a>
                <a href="/admin/students" className="btn btn-primary" style={{ fontWeight: 600 }}>
                    🧑‍🎓 Manage Students
                </a>
                <a href="/admin/menu" className="btn btn-secondary" style={{ fontWeight: 600 }}>
                    🍽️ Manage Menu
                </a>
            </div>
        </div>
    );
};

export default AdminDashboard;
