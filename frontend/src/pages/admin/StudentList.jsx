import { useEffect, useState } from 'react';
import AdminService from '../../services/admin.service';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        AdminService.getAllStudents().then(data => {
            if (Array.isArray(data)) {
                setStudents(data);
            } else {
                console.error("Expected array of students");
            }
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="card">
            <h2>Registered Students</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.studentId || student.id}>
                            <td>{student.studentId || student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.courseName}</td>
                            <td>{student.mobileNo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;
