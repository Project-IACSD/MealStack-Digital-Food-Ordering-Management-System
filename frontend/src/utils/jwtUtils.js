/**
 * JWT Utility Functions
 * Decode JWT token and extract user information
 */

/**
 * Decode JWT token without verification (client-side only)
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Extract role from JWT token
 * @param {string} token - JWT token string
 * @returns {string|null} - Role (STUDENT/ADMIN) or null
 */
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Check for role in token (could be 'role', 'authorities', etc.)
  return decoded.role || decoded.authorities?.[0]?.authority || null;
};

/**
 * Extract email from JWT token
 * @param {string} token - JWT token string
 * @returns {string|null} - Email or null
 */
export const getEmailFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return decoded.sub || decoded.email || null;
};

/**
 * Check if token is expired
 * @param {string} token - JWT token string
 * @returns {boolean} - True if expired or invalid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get student ID from token or localStorage
 * @returns {string|null} - Student ID or null
 */
export const getStudentId = () => {
  const token = localStorage.getItem('token');
  let id = null;

  if (token && !isTokenExpired(token)) {
    const decoded = decodeToken(token);
    id = decoded?.studentId;
  }

  if (!id || id === 'undefined' || id === 'null') {
    id = localStorage.getItem('studentId');
  }

  return (id && id !== 'undefined' && id !== 'null') ? id : null;
};
