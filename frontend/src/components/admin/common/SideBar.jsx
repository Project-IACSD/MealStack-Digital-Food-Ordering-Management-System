import React, { useState } from 'react';
import { Box, Typography, useTheme, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import { useAuth } from '../../../auth/AuthContext';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GradingIcon from '@mui/icons-material/Grading';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected === title}
        onClick={() => {
          setSelected(title);
          navigate(to);
        }}
        sx={{
          "&.Mui-selected": {
            backgroundColor: colors.blueAccent[800],
            "&:hover": {
              backgroundColor: colors.blueAccent[700],
            }
          },
          "&:hover": {
            backgroundColor: colors.primary[400],
            color: "#868dfb"
          },
          color: colors.grey[100]
        }}
      >
        <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

export default function SideBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { logout } = useAuth();
  const location = useLocation();

  // Sync selection with URL
  React.useEffect(() => {
    if (location.pathname.includes("dashboard")) setSelected("Dashboard");
    else if (location.pathname.includes("students")) setSelected("Manage Students");
    else if (location.pathname.includes("menu")) setSelected("Manage Menu");
    else if (location.pathname.includes("pending")) setSelected("Pending Orders");
    else if (location.pathname.includes("completed")) setSelected("Completed Orders");
  }, [location]);

  return (
    <Box
      sx={{
        width: "250px",
        height: "100vh", // Full viewport height
        backgroundColor: colors.primary[400],
        display: "flex",
        flexDirection: "column",
        boxShadow: "3px 0px 10px rgba(0,0,0,0.2)",
        position: "fixed", // Fix to left
        left: 0,
        top: 0,
        zIndex: 1000
      }}
    >
      {/* HEADER */}
      <Box p="20px" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Avatar sx={{ bgcolor: colors.greenAccent[500], width: 56, height: 56, mb: 1 }}>
          <AdminPanelSettingsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
          ADMIN
        </Typography>
        <Typography variant="h6" color={colors.greenAccent[500]}>
          Canteen System
        </Typography>
      </Box>

      <Divider />

      {/* MENU ITEMS */}
      <Box flexGrow={1} overflow="auto">
        <List>
          <Item
            title="Dashboard"
            to="/admin/dashboard"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Data
          </Typography>
          <Item
            title="Manage Students"
            to="/admin/students"
            icon={<SchoolIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Manage Menu"
            to="/admin/menu"
            icon={<RestaurantMenuIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Orders
          </Typography>
          <Item
            title="Pending Orders"
            to="/admin/orders/pending"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Completed Orders"
            to="/admin/orders/completed"
            icon={<GradingIcon />}
            selected={selected}
            setSelected={setSelected}
          />
        </List>
      </Box>

      <Divider />

      {/* FOOTER */}
      <Box p="10px">
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            fontWeight: "bold",
            backgroundColor: colors.redAccent[500],
            "&:hover": { backgroundColor: colors.redAccent[700] }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
