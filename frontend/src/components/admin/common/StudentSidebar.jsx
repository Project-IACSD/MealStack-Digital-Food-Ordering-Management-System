import React, { useState } from 'react';
import { Box, Typography, useTheme, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { tokens } from "../../../theme";
import { useAuth } from '../../../auth/AuthContext';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';


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

export default function StudentSideBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { logout } = useAuth();
  const location = useLocation();

  // Sync selection with URL
  React.useEffect(() => {
    if (location.pathname.includes("dashboard")) setSelected("Dashboard");
    else if (location.pathname.includes("dailymenu")) setSelected("Today's Menu");
    else if (location.pathname.includes("todaysmenu")) setSelected("Order Food");
    else if (location.pathname.includes("orderhistory")) setSelected("Order History");
    else if (location.pathname.includes("wallettopup")) setSelected("Top up Wallet");
    else if (location.pathname.includes("rechargehistory")) setSelected("Recharge History");
    else if (location.pathname.includes("changePassword")) setSelected("Change Password");
  }, [location]);

  return (
    <Box
      sx={{
        width: "250px",
        height: "100vh",
        backgroundColor: colors.primary[400],
        display: "flex",
        flexDirection: "column",
        boxShadow: "3px 0px 10px rgba(0,0,0,0.2)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000
      }}
    >
      {/* HEADER */}
      <Box p="20px" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Avatar sx={{ bgcolor: colors.greenAccent[500], width: 56, height: 56, mb: 1 }}>
          <SchoolIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
          STUDENT
        </Typography>
        <Typography variant="subtitle1" color={colors.greenAccent[500]}>
          {localStorage.getItem("name") || "Student"}
        </Typography>
      </Box>

      <Divider />

      {/* MENU ITEMS */}
      <Box flexGrow={1} overflow="auto">
        <List>
          <Item
            title="Dashboard"
            to="/student/dashboard"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Menu & Food
          </Typography>
          <Item
            title="Today's Menu"
            to="/student/dailymenu"
            icon={<RestaurantMenuIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Order Food"
            to="/student/todaysmenu"
            icon={<FastfoodIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            History & Wallet
          </Typography>
          <Item
            title="Order History"
            to="/student/orderhistory"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Top up Wallet"
            to="/student/wallettopup"
            icon={<AccountBalanceWalletIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Recharge History"
            to="/student/rechargehistory"
            icon={<HistoryIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Typography
            variant="h6"
            color={colors.grey[300]}
            sx={{ m: "15px 0 5px 20px" }}
          >
            Settings
          </Typography>
          <Item
            title="Change Password"
            to="/student/changePassword"
            icon={<LockResetIcon />}
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
