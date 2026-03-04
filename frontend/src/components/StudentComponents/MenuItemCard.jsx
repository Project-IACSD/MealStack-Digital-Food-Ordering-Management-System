import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import defimg from '../../assets/pick-meals-image.png';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Map item name/category to local food images
const getItemImage = (item) => {
    if (item.itemImage || item.itemImgLink) return item.itemImage || item.itemImgLink;
    const name = (item.itemName || '').toLowerCase();
    const category = (item.itemCategory || '').toLowerCase();
    if (name.includes('dosa') || name.includes('dose')) return '/foodimages/dosa.jpg';
    if (name.includes('idli') || name.includes('idili') || name.includes('idly')) return '/foodimages/idili.jpg';
    if (name.includes('samosa')) return '/foodimages/samosa.png';
    if (name.includes('pizza')) return '/foodimages/pizza.jpg';
    if (category.includes('breakfast')) return '/foodimages/idili.jpg';
    if (category.includes('lunch') || category.includes('snack')) return '/foodimages/samosa.png';
    return '/foodimages/dosa.jpg';
};

const MenuItemCard = ({ item, orderQty, onAdd, onRemove }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Card
            sx={{
                maxWidth: 345,
                borderRadius: '16px',
                backgroundColor: colors.primary[400],
                boxShadow: 4,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)'
                }
            }}
        >
            <CardMedia
                component="img"
                height="140"
                image={getItemImage(item)}
                alt={item.itemName}
                onError={(e) => { e.target.src = '/foodimages/samosa.png'; }}
                sx={{
                    objectFit: 'cover',
                    height: '140px',
                    width: '100%'
                }}
            />
            <CardContent sx={{ pb: 1, flexGrow: 1 }}>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                    color={colors.grey[100]}
                    noWrap
                >
                    {item.itemName}
                </Typography>
                <Typography variant="h6" color={colors.greenAccent[500]}>
                    ₹{item.itemPrice}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: colors.redAccent[500],
                        minWidth: '40px',
                        '&:hover': { backgroundColor: colors.redAccent[600] },
                        '&.Mui-disabled': { backgroundColor: colors.primary[500] }
                    }}
                    size="small"
                    onClick={() => onRemove(item)}
                    disabled={!orderQty}
                >
                    <RemoveIcon fontSize="small" />
                </Button>

                <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                    {orderQty || 0}
                </Typography>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: colors.greenAccent[600],
                        minWidth: '40px',
                        '&:hover': { backgroundColor: colors.greenAccent[700] }
                    }}
                    size="small"
                    onClick={() => onAdd(item)}
                >
                    <AddIcon fontSize="small" />
                </Button>
            </CardActions>
        </Card>
    );
};

export default MenuItemCard;
