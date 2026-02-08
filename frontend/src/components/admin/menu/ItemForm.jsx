import React, { useState } from "react";
import { Box, Button, TextField, MenuItem, Typography, Avatar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../common/Header";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ItemForm(props) {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [imagePreview, setImagePreview] = useState(
        props.action === "edit" && props.itemData?.itemImage
            ? props.itemData.itemImage
            : ""
    );

    const initValues =
        props.action === "add"
            ? {
                itemName: "",
                itemPrice: "",
                itemCategory: "",
                itemGenre: "SouthIndian",
                itemImgLink: `https://via.placeholder.com/150?t=${Date.now()}`,
                itemImage: "",
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
        itemImgLink: yup.string(),
        itemImage: yup.string().required("Please upload an image"),
    });

    const handleFormSubmit = (values) => {
        console.log(values);
        props.takeAction(values);
    };

    const handleImageChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert("Please upload an image file");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                setFieldValue("itemImage", base64String);
                // Generate unique placeholder to avoid duplicate key constraint
                setFieldValue("itemImgLink", `https://via.placeholder.com/150?t=${Date.now()}`);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (setFieldValue) => {
        setImagePreview("");
        setFieldValue("itemImgLink", "");
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
                        setFieldValue,
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

                                    {/* Image Upload Section */}
                                    <Box sx={{ gridColumn: "span 4" }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Item Image
                                        </Typography>

                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                                <Avatar
                                                    src={imagePreview}
                                                    alt="Item preview"
                                                    sx={{ width: 100, height: 100 }}
                                                    variant="rounded"
                                                />
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleRemoveImage(setFieldValue)}
                                                >
                                                    Remove Image
                                                </Button>
                                            </Box>
                                        )}

                                        {/* File Input */}
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<CloudUploadIcon />}
                                            fullWidth
                                        >
                                            {imagePreview ? "Change Image" : "Upload Image"}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                            />
                                        </Button>
                                        {touched.itemImgLink && errors.itemImgLink && (
                                            <Typography color="error" variant="caption" display="block" mt={1}>
                                                {errors.itemImgLink}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                                            Supported formats: JPG, PNG, GIF (Max 5MB)
                                        </Typography>
                                    </Box>
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
