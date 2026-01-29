import React, { useContext } from 'react'
import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material"; // Added Menu/MenuItem for future use if needed, or just keep simple
import { ColorModeContext, tokens } from './theme';
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import cmslogo from './assets/cms-high-resolution-logo-removebg.png'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

export default function NavBar() {
  const theme = useTheme();//Theme from material ui [Calls useMode from 'theme']
  const colors = tokens(theme.palette.mode); //Change colors according to the theme mode (light or dark)
  const colorMode = useContext(ColorModeContext);  //Accesses context for color mode in 'colorMode'. 
  const navigate = useNavigate();
  const { hasRole, logout } = useAuth(); // Assuming logout might be useful too?

  const handleProfileClick = () => {
    if (hasRole('STUDENT')) {
      navigate('/student/profile');
    } else if (hasRole('ADMIN')) {
      // navigate('/admin/profile'); // If exists
    }
  };

  const handleSettingsClick = () => {
    if (hasRole('STUDENT')) {
      navigate('/student/changePassword');
    }
  };

  return (
    //Box => div + inline css
    <Box display="flex" justifyContent="space-between" p={0}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
        <img src={cmslogo} alt='MealStack' style={{ width: '100px', height: "auto", backgroundColor: theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc" }} />


      </Box>


      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {/* React context that allows us to change mode from dark to light */}
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={() => alert("No new notifications")}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleSettingsClick}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleProfileClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
