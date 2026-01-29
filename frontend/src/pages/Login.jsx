import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tab,
  Tabs,
  InputGroup,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [key, setKey] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  // Auth context
  const { studentLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleTabSelect = (k) => {
    setKey(k);
    setError('');
    setValidated(false);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setError('');
    setLoading(true);

    try {
      let result;
      if (key === 'student') {
        result = await studentLogin(email, password);
        if (result.success) navigate('/student/dashboard');
      } else {
        result = await adminLogin(email, password);
        if (result.success) navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {showPassword ? "Hide Password" : "Show Password"}
    </Tooltip>
  );

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#121212' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0 rounded-4 text-white" style={{ backgroundColor: '#1E1E1E' }}>
            <Card.Header className="bg-transparent border-0 text-center pt-5 pb-3">
              <h2 className="fw-bold mb-2 text-white tracking-wide">Welcome Back</h2>
              <p className="text-secondary small text-uppercase letter-spacing-2 mb-0">Campus Canteen Management System</p>
            </Card.Header>

            <Card.Body className="p-4 px-md-5">
              <Tabs
                id="login-tabs"
                activeKey={key}
                onSelect={handleTabSelect}
                className="mb-4 text-center justify-content-center border-bottom-0 nav-pills-custom"
                fill
                variant="pills"
              >
                <Tab eventKey="student" title="STUDENT" tabClassName={`fw-bold rounded-pill mx-1 ${key === 'student' ? 'bg-primary text-white shadow-sm' : 'bg-dark text-secondary'}`} />
                <Tab eventKey="admin" title="ADMIN" tabClassName={`fw-bold rounded-pill mx-1 ${key === 'admin' ? 'bg-danger text-white shadow-sm' : 'bg-dark text-secondary'}`} />
              </Tabs>

              {error && (
                <Alert variant="danger" className="py-2 text-center small border-0 bg-danger bg-opacity-10 text-danger fw-bold">
                  {error}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Email Field */}
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label className="small text-uppercase fw-bold text-secondary mb-2">Email Address</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-dark border-secondary text-secondary">
                      <FaUser size={14} />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-dark text-white border-secondary py-2"
                      style={{ boxShadow: 'none' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="small text-uppercase fw-bold text-secondary mb-2">Password</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-dark border-secondary text-secondary">
                      <FaLock size={14} />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-dark text-white border-secondary py-2"
                      style={{ boxShadow: 'none' }}
                    />
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <Button
                        variant="outline-secondary"
                        className="border-secondary text-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </Button>
                    </OverlayTrigger>

                    <Form.Control.Feedback type="invalid">
                      Password is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="remember-me"
                    label="Remember me"
                    className="text-secondary small custom-checkbox"
                  />
                  <Link to="/forgot-password" className="text-decoration-none small text-info fw-bold">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  variant={key === 'student' ? "primary" : "danger"}
                  type="submit"
                  className="w-100 py-3 fw-bold shadow active-scale"
                  disabled={loading}
                  style={{ letterSpacing: '1px', transition: 'all 0.2s' }}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      AUTHENTICATING...
                    </>
                  ) : (
                    `LOGIN AS ${key === 'student' ? 'STUDENT' : 'ADMIN'}`
                  )}
                </Button>
              </Form>
            </Card.Body>

            <Card.Footer className="bg-transparent border-0 text-center pb-5">
              <small className="text-secondary">
                Not registered yet? <Link to="/register" className={`text-decoration-none fw-bold ${key === 'student' ? 'text-primary' : 'text-danger'} ms-1`}>Create an Account</Link>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
