import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axios';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  InputGroup
} from 'react-bootstrap';
import {
  FaUsers,
  FaUserGraduate,
  FaWallet,
  FaSync,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUp
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all students
      const studentsResponse = await api.get('/admin/students');
      setStudents(studentsResponse.data || []);

      // Fetch total student count
      const countResponse = await api.get('/admin/totalstudents');
      setTotalStudents(countResponse.data || 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate Metrics
  const totalBalance = students.reduce((sum, s) => sum + (s.balance || 0), 0);
  const activeStudents = students.length;

  // Filter & Sort Logic
  const filteredStudents = students
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.studentId).includes(searchTerm)
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getBalanceBadgeClass = (amount) => {
    if (amount < 100) return 'badge-danger-custom';
    if (amount < 500) return 'badge-warning-custom';
    return 'badge-success-custom';
  };

  if (loading) {
    return (
      <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-admin-dark">
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 bg-admin-dark min-vh-100 text-admin-primary">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold mb-0 text-white tracking-wide">Admin Dashboard</h2>
          <p className="text-admin-secondary small">MealStack System Overview & Student Management</p>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary" // Using Primary but styled with CSS var if needed, default bootstrap blue is close to our accent
            size="sm"
            onClick={fetchData}
            className="d-flex align-items-center gap-2 shadow-sm"
            style={{ backgroundColor: 'var(--admin-accent)', borderColor: 'var(--admin-accent)' }}
          >
            <FaSync className={loading ? 'fa-spin' : ''} /> Refresh Data
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 bg-danger bg-opacity-10 border-danger text-danger">
          {error}
        </Alert>
      )}

      {/* KPI Cards */}
      <Row className="g-3 mb-4">
        {/* Total Students */}
        <Col md={4}>
          <Card className="h-100 bg-admin-card border-admin shadow-sm text-admin-primary">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                <FaUsers size={24} className="text-primary" />
              </div>
              <div>
                <h6 className="text-admin-secondary text-uppercase small fw-bold mb-1">Total Students</h6>
                <h3 className="mb-0 fw-bold">{totalStudents}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Active Students */}
        <Col md={4}>
          <Card className="h-100 bg-admin-card border-admin shadow-sm text-admin-primary">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                <FaUserGraduate size={24} className="text-info" />
              </div>
              <div>
                <h6 className="text-admin-secondary text-uppercase small fw-bold mb-1">Active Accounts</h6>
                <h3 className="mb-0 fw-bold">{activeStudents}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Wallet Balance */}
        <Col md={4}>
          <Card className="h-100 bg-admin-card border-admin shadow-sm text-admin-primary">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                <FaWallet size={24} className="text-success" />
              </div>
              <div>
                <h6 className="text-admin-secondary text-uppercase small fw-bold mb-1">Total Wallet Value</h6>
                <h3 className="mb-0 fw-bold">₹ {totalBalance.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Students Table Section */}
      <Card className="bg-admin-card border-admin shadow-sm text-admin-primary">
        <Card.Body className="p-0">
          <div className="p-3 border-bottom border-admin d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Registered Students</h5>
            <div style={{ width: '300px' }}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-admin-dark border-secondary text-admin-secondary">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-admin-dark text-admin-primary border-secondary"
                  style={{ boxShadow: 'none' }}
                />
              </InputGroup>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover variant="dark" className="align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead className="admin-table-header">
                <tr>
                  <th onClick={() => handleSort('studentId')} role="button" className="py-3 ps-4 border-bottom border-admin">
                    ID {sortConfig.key === 'studentId' && (sortConfig.direction === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
                  </th>
                  <th onClick={() => handleSort('name')} role="button" className="py-3 border-bottom border-admin">
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />)}
                  </th>
                  <th onClick={() => handleSort('email')} role="button" className="py-3 border-bottom border-admin">
                    Email
                  </th>
                  <th className="py-3 border-bottom border-admin">Mobile</th>
                  <th onClick={() => handleSort('courseName')} role="button" className="py-3 border-bottom border-admin">
                    Course
                  </th>
                  <th onClick={() => handleSort('balance')} role="button" className="py-3 text-end pe-4 border-bottom border-admin">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.studentId} className="admin-table-row border-bottom border-admin">
                      <td className="ps-4 fw-bold text-admin-secondary py-3">#{student.studentId}</td>
                      <td className="fw-bold text-admin-primary">{student.name}</td>
                      <td className="text-admin-secondary small">{student.email}</td>
                      <td className="text-admin-secondary small">{student.mobileNo}</td>
                      <td>
                        <Badge bg="dark" className="border border-secondary fw-normal text-info bg-opacity-50">
                          {student.courseName}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        {/* Custom Badge Logic */}
                        <span className={`badge ${getBalanceBadgeClass(student.balance)} fw-normal px-2 py-1`}>
                          ₹{typeof student.balance === 'number' ? student.balance.toFixed(2) : '0.00'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-admin-secondary">
                      <div className="mb-2"><FaUserGraduate size={32} className="opacity-25" /></div>
                      No students found searching for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="p-3 border-top border-admin text-end">
            <small className="text-admin-secondary">Showing {filteredStudents.length} of {students.length} entries</small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;
