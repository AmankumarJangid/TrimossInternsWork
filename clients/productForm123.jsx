// src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  IconButton,
  Stack,
  Avatar,
} from '@mui/material';
import { Delete, Add, CloudUpload } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { productFormSchema } from '../../utils/zodProductValidation.js';
import DynamicAttributeInput from './DynamicAttributeInput';
import api from '../../utils/axiosInterceptor';

export default function ProductForm({ initialData, onSuccess }) {
  const token = useSelector((state) => state.auth.token);
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState({
    primary: null,
    gallery: [],
    technical: [],
    roomScenes: [],
  });

  // 1) useForm with zodResolver
  const {
    control,
    register,
    handleSubmit,     // ✓ handleSubmit is a function
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: '',
      sku: '',
      description: { short: '', detailed: '' },
      categories: [],
      dimensions: { length: 0, width: 0, thickness: 0, unit: 'mm' },
      pricing: { basePrice: 0, currency: 'USD', minimumOrderQuantity: 1 },
      inventory: { quantity: 0, lowStockThreshold: 10 },
      isActive: true,
      isFeatured: false,
      supplier: { name: '', contactInfo: {}, leadTime: 14 },
      colorVariants: [],
      dynamicAttributes: [],
      certifications: [],
    },
  });

  // 2) reset form when editing
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  // 3) dynamic arrays
  const { fields: colorFields, append: addColor, remove: delColor } = useFieldArray({
    control,
    name: 'colorVariants',
  });
  const { fields: attrFields, append: addAttr, remove: delAttr } = useFieldArray({
    control,
    name: 'dynamicAttributes',
  });

  // 4) file previews
  const handleFileChange = (type, files) => {
    const arr = Array.from(files);
    const limits = { gallery: 4, technical: 5, roomScenes: 5 };
    if (type !== 'primary' && arr.length > limits[type]) {
      enqueueSnackbar(`Max ${limits[type]} files for ${type}`, { variant: 'warning' });
      return;
    }
    setPreviews((p) => ({
      ...p,
      [type]: type === 'primary' ? URL.createObjectURL(arr[0]) : arr.map((f) => URL.createObjectURL(f)),
    }));
    setValue(type === 'primary' ? 'primaryImage' : `${type}Images`, files);
  };

  // 5) onSubmit receives *data*, not event
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // strip files out for JSON
      const clone = { ...data };
      delete clone.primaryImage;
      delete clone.galleryImages;
      delete clone.technicalImages;
      delete clone.roomSceneImages;

      const fd = new FormData();
      fd.append('productData', JSON.stringify(clone));
      if (data.primaryImage) fd.append('primary', data.primaryImage[0]);
      ['gallery', 'technical', 'roomScenes'].forEach((key) => {
        const arrKey = `${key}Images`;
        if (data[arrKey]) Array.from(data[arrKey]).forEach((f) => fd.append(key, f));
      });

      await api.post('/products', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      enqueueSnackbar('Product saved!', { variant: 'success' });
      reset();
      setPreviews({ primary: null, gallery: [], technical: [], roomScenes: [] });
      onSuccess?.();
    } catch (e) {
      console.error(e);
      enqueueSnackbar('Save failed', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 6) native <form> via Box component
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      {/* --- Basic Information --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="SKU"
              fullWidth
              {...register('sku')}
              error={!!errors.sku}
              helperText={errors.sku?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Short Description"
              fullWidth
              multiline
              rows={2}
              {...register('description.short')}
              error={!!errors.description?.short}
              helperText={errors.description?.short?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Detailed Description"
              fullWidth
              multiline
              rows={4}
              {...register('description.detailed')}
              error={!!errors.description?.detailed}
              helperText={errors.description?.detailed?.message}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* --- Categories --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.categories}>
              <InputLabel>Categories</InputLabel>
              <Select multiple {...field} label="Categories">
                {['Tile', 'Stone', 'Metal', 'Wood', 'Glass'].map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.categories?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Paper>

      {/* --- Dimensions --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dimensions
        </Typography>
        <Grid container spacing={2}>
          {['length', 'width', 'thickness'].map((d) => (
            <Grid item xs={4} key={d}>
              <TextField
                label={d.charAt(0).toUpperCase() + d.slice(1)}
                type="number"
                fullWidth
                {...register(`dimensions.${d}`, { valueAsNumber: true })}
                error={!!errors.dimensions?.[d]}
                helperText={errors.dimensions?.[d]?.message}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select {...register('dimensions.unit')} label="Unit">
                {['mm', 'cm', 'inch'].map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* --- Color Variants --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Color Variants
        </Typography>
        <Stack spacing={2}>
          {colorFields.map((f, i) => (
            <Grid container spacing={1} alignItems="center" key={f.id}>
              <Grid item xs>
                <TextField label="Color" fullWidth {...register(`colorVariants.${i}.name`)} />
              </Grid>
              <Grid item xs>
                <TextField label="Hex" fullWidth {...register(`colorVariants.${i}.hexCode`)} />
              </Grid>
              <Grid item>
                <IconButton onClick={() => delColor(i)} color="error">
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<Add />} onClick={() => addColor({ name: '', hexCode: '' })}>
            Add Variant
          </Button>
        </Stack>
      </Paper>

      {/* --- Dynamic Attributes --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dynamic Attributes
        </Typography>
        <Stack spacing={2}>
          {attrFields.map((f, i) => (
            <Paper key={f.id} sx={{ p: 1, position: 'relative' }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={3}>
                  <TextField label="Key" fullWidth {...register(`dynamicAttributes.${i}.key`)} />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select defaultValue="string" {...register(`dynamicAttributes.${i}.dataType`)} label="Type">
                      {['string', 'number', 'boolean', 'date'].map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <DynamicAttributeInput
                    dataType={watch(`dynamicAttributes.${i}.dataType`)}
                    value={watch(`dynamicAttributes.${i}.value`)}
                    onChange={(val) => setValue(`dynamicAttributes.${i}.value`, val)}
                  />
                </Grid>
                <IconButton
                  onClick={() => delAttr(i)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Paper>
          ))}
          <Button startIcon={<Add />} onClick={() => addAttr({ key: '', dataType: 'string', value: '' })}>
            Add Attribute
          </Button>
        </Stack>
      </Paper>

      {/* --- Images --- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Images
        </Typography>
        <Stack spacing={2}>
          {['primary', 'gallery', 'technical', 'roomScenes'].map((type) => (
            <div key={type}>
              <label>
                <Button startIcon={<CloudUpload />} component="span">
                  Upload {type}
                  <input
                    type="file"
                    hidden
                    multiple={type !== 'primary'}
                    onChange={(e) => handleFileChange(type, e.target.files)}
                  />
                </Button>
              </label>
              <Stack direction="row" spacing={1} mt={1}>
                {(type === 'primary' ? [previews.primary] : previews[type]).map(
                  (src, idx) => src && <Avatar key={idx} src={src} />
                )}
              </Stack>
            </div>
          ))}
        </Stack>
      </Paper>

      {/* --- Submit --- */}
      <Box textAlign="right">
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save Product'}
        </Button>
      </Box>
    </Box>
  );
}
