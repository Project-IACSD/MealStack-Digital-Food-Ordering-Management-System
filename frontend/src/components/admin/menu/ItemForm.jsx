import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from "@mui/icons-material/Edit";

export default function ItemForm(props) {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const initValues =
        props.action === "add"
            ? {
                itemName: "",
                itemPrice: "",
                itemCategory: "",
                itemGenre: "SouthIndian",
                itemImgLink: "",
            }
            : props.itemData;

    const itemCategories = [
        { value: "Breakfast", label: "Breakfast" },
        { value: "Lunch", label: "Lunch" },
        { value: "Snacks", label: "Snacks" },
        { value: "Dinner", label: "Dinner" },
        { value: "Beverages", label: "Beverages" },
    ];

    const itemGenres = [
        { value: "SouthIndian", label: "South Indian" },
        { value: "Oriental", label: "Oriental" },
        { value: "NorthIndian", label: "North Indian" },
        { value: "Maharashtrian", label: "Maharashtrian" },
    ];

    const itemSchema = yup.object().shape({
        itemName: yup.string().required("Required"),
        itemPrice: yup.number().required("Required").positive("Price must be positive"),
        itemCategory: yup.string().required("Required"),
        itemGenre: yup.string().required("Required"),
        itemImgLink: yup.string().required("Required"),
    });

    const handleFormSubmit = (values) => {
        console.log(values);
        props.takeAction(values);
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight={"80vh"}
        >
            <Box border={"1px solid black"} m={"20px"} p="40px" borderRadius={5} width={isNonMobile ? "50%" : "90%"}>
                <Header title={props.title} subtitle={props.subtitle}></Header>
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initValues}
                    validationSchema={itemSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => {
                        return (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": {
                                            gridColumn: isNonMobile ? undefined : "span 4",
                                        },
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Item Name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.itemName}
                                        name="itemName"
                                        error={!!touched.itemName && !!errors.itemName}
                                        helperText={touched.itemName && errors.itemName}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Item Price"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.itemPrice}
                                        name="itemPrice"
                                        error={!!touched.itemPrice && !!errors.itemPrice}
                                        helperText={touched.itemPrice && errors.itemPrice}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        variant="filled"
                                        label="Item Category"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.itemCategory}
                                        name="itemCategory"
                                        error={!!touched.itemCategory && !!errors.itemCategory}
                                        helperText={touched.itemCategory && errors.itemCategory}
                                        sx={{ gridColumn: "span 4" }}
                                    >
                                        {itemCategories.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        select
                                        variant="filled"
                                        label="Item Genre"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.itemGenre}
                                        name="itemGenre"
                                        error={!!touched.itemGenre && !!errors.itemGenre}
                                        helperText={touched.itemGenre && errors.itemGenre}
                                        sx={{ gridColumn: "span 4" }}
                                    >
                                        {itemGenres.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Image Link"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.itemImgLink}
                                        name="itemImgLink"
                                        error={!!touched.itemImgLink && !!errors.itemImgLink}
                                        helperText={touched.itemImgLink && errors.itemImgLink}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button type="submit" color="secondary" variant="contained">
                                        {props.action === "add" ? (
                                            <span>
                                                <PlaylistAddIcon />
                                                &nbsp;&nbsp;Add Item
                                            </span>
                                        ) : (
                                            <span>
                                                <EditIcon />
                                                &nbsp;&nbsp;Update Item
                                            </span>
                                        )}
                                    </Button>
                                </Box>
                            </form>
                        );
                    }}
                </Formik>
            </Box>
        </Box>
    );
}
