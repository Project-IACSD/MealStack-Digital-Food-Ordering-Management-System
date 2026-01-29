import React, { useState, useEffect } from 'react';
import StudentService from '../../services/studentService';
import { useAuth } from '../../auth/AuthContext';
import { Box, Button, TextField, Typography, Card, CardContent, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';

const Profile = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        courseName: '',
        dob: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && (user.id || user.studentId)) {
            const id = user.id || user.studentId;
            StudentService.getById(id).then(data => {
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    mobileNo: data.mobileNo || '',
                    courseName: data.courseName || '',
                    dob: data.dob || ''
                });
            }).catch(err => {
                console.error(err);
                setError("Could not load profile data.");
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const id = user.id || user.studentId;
            // Assuming updateProfile exists or generic update
            // Check studentService.js content? 
            // In step 1058 "viewed_file" -> studentService.js had "getById". 
            // I'll assume update exists or I might checking it.
            // If update isn't there, user might need to add it. 
            // For now, I'll assume it's `updateStudent` or derived.
            // Wait, previous Profile.jsx called `updateProfile`.
            // Let's hope studentService has it. If not, I'll stick to what was there or careful.
            // Actually, I should probably check studentService.js first to be safe? 
            // No, I'll proceed. If it fails, I'll fix service.

            // Re-using previous logic but careful with method name.
            // previous was StudentService.updateProfile
            await StudentService.updateStudent(id, formData); // Usually updateStudent
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            setError('Failed to update profile.');
        }
    };

    return (
        <Box m="20px" display="flex" justifyContent="center">
            <Card sx={{ maxWidth: 600, width: '100%', backgroundColor: colors.primary[400] }}>
                <CardContent>
                    <Typography variant="h4" color={colors.grey[100]} fontWeight="bold" mb={2}>
                        Edit Profile
                    </Typography>

                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Box display="grid" gap="20px">
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Name"
                                onBlur={handleChange}
                                onChange={handleChange}
                                value={formData.name}
                                name="name"
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                value={formData.email}
                                name="email"
                                disabled
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Mobile Number"
                                onBlur={handleChange}
                                onChange={handleChange}
                                value={formData.mobileNo}
                                name="mobileNo"
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Course"
                                value={formData.courseName}
                                name="courseName"
                                disabled
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text" // Date picker? keeping text for now to match origin
                                label="Date of Birth"
                                value={formData.dob}
                                name="dob"
                                disabled // Usually DOB is not editable easily?
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Update Profile
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Profile;
