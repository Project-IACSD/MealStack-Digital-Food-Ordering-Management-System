

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from '../../../theme';
import StudentService from "../../../services/studentService";

export default function StudentData() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => { 
    StudentService.getStudentCount()
      .then((response) => {
        // Handle both direct number response and object with data property
        const count = typeof response === 'number' ? response : (response?.data || response || 0);
        setStudentCount(count);
      })
      .catch((e) => {
        console.error('Error fetching student count:', e);
        setStudentCount(0);
      });
  }, []);

  return (
    <Box bgcolor={colors.primary[600]} alignContent={'center'} height={'250px'}>
      <Typography variant="h4" align='center'>Student Data:</Typography><br/><br/><br/><br/>
      <Typography variant="h5" align="center">Number of students registered:<h2> {studentCount}</h2>  </Typography>
    </Box>
  );
}
