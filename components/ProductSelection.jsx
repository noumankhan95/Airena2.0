'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, TextField } from '@mui/material';

export default function ProductSelection({ open, onClose, onProductsSelect }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [vendorName, setVendorName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch products when search button is clicked
    const fetchProducts = async (vendor = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/api/vendor/fetch_products?vendor=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            console.log(data, "vendor products Data")
            setProducts(data.edges || []);
        } catch (error) {
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelect = (product) => {
        if (selectedProducts.find(p => p.node.id === product.node.id)) {
            setSelectedProducts(selectedProducts.filter(p => p.node.id !== product.node.id));
        } else if (selectedProducts.length < 2) {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleConfirm = () => {
        onProductsSelect(selectedProducts);
        onClose();
    };

    const handleSearch = () => {
        fetchProducts(searchQuery); // Fetch products when search button is clicked
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Select Products for Advertisement (Max 2)
            </DialogTitle>
            <DialogContent>
                <div className="flex gap-2 items-center p-2">
                    <TextField
                        label="Search Vendor"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Updates search query immediately
                    />
                    <Button onClick={handleSearch} variant="contained" color="primary">
                        Search
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-4">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <Typography color="error" className="p-4">{error}</Typography>
                ) : products.length === 0 ? (
                    <Typography className="p-4">No products found.</Typography>
                ) : (
                    <Grid container spacing={2} className="mt-2">
                        {products?.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.node.id}>
                                <Card
                                    className={`cursor-pointer transition-all ${selectedProducts?.find(p => p.node.id === product.node.id)
                                        ? 'border-2 border-green-500'
                                        : ''
                                        }`}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={product.node?.images?.edges[0]?.node?.url || '/placeholder.png'}
                                        alt={product.node.title}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {product.node.title}
                                        </Typography>
                                        {product.node.variants?.edges?.map(variant => {
                                            console.log("Variant", variant)
                                            return (
                                                <Box key={variant.node.id}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {variant.node.title} - {variant.node.price} INR
                                                    </Typography>
                                                    <Button
                                                        onClick={() => handleProductSelect({ ...product, variant: variant.node, vendor: searchQuery })}
                                                    >
                                                        Advertise
                                                    </Button>
                                                </Box>
                                            )
                                        })}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} variant="contained" disabled={selectedProducts.length === 0}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
