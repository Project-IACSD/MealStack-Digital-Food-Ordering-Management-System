import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { Box, IconButton, Typography, useTheme, Button, Grid } from "@mui/material";
import { tokens } from "../../../theme";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetails(props) {
  const location = useLocation();
  const navigate = useNavigate();

  // Debug: Log the location state
  console.log("OrderDetails location.state:", location.state);

  // Handle missing state
  if (!location.state) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" color="error">
          No order data found. Please go back and try again.
        </Typography>
      </Box>
    );
  }

  const takeAction = () => {
    props.takeAction(location.state.orderId);
  };
  const baseUrl = "/admin/orders/"
  const goBack = () => {
    location.state["orderStatus"] === "PENDING" ? navigate(baseUrl + "pending") : navigate(baseUrl + "completed");
  }

  let carts = location.state["cartList"] || location.state["carts"] || []; // Try cartList first, then carts
  const studentName = location.state["studentName"] || location.state["name"] || "Unknown"; // Handle both field names
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const card = (
    <CardContent sx={{ background: colors.grey[700] }}>
      <Typography
        sx={{ fontSize: 14 }}
        color={`${colors.primary[100]}`}
        gutterBottom
      >
        Student Name:
      </Typography>
      <Typography variant="h5">{studentName}</Typography>
      <br />
      <Typography
        sx={{ fontSize: 14 }}
        color={`${colors.primary[100]}`}
        gutterBottom
      >
        Order Details:
      </Typography>
      {carts.map((cart, index) => (
        <Typography variant="h5" key={index}>
          Item : {cart.itemName || 'Unknown Item'}&nbsp;&nbsp; Quantity : {cart.qtyOrdered}
        </Typography>
      ))}
      <br />
      <Typography
        sx={{ fontSize: 14 }}
        color={`${colors.primary[100]}`}
        gutterBottom
      >
        Amount :
      </Typography>
      <Typography variant="h5">{location.state["amount"]}&nbsp;&#8377;</Typography>
    </CardContent>
  );
  return (
    <Box display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={"100vh"}>
      <Box sx={{ minWidth: 275 }} >
        <Card variant="outlined">{card}</Card>
        <Grid container>
          {
            location.state["orderStatus"] === "PENDING" ?
              <Grid item sm={6}>
                <button
                  className={props.action === "display" ? "btn btn-success" : "btn btn-danger"}
                  onClick={takeAction}
                >
                  {props.action === "display" ? (
                    <span>
                      <AssignmentTurnedInIcon />
                      &nbsp;Mark Completed
                    </span>
                  ) : (
                    <span>
                      <DeleteIcon />
                      &nbsp;Delete Order
                    </span>
                  )}
                </button>
              </Grid>
              : null
          }
          <Grid item sm={6}>
            <button className="btn btn-primary" onClick={goBack}>Back to List</button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
