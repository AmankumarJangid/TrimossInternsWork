// src/components/admin/TestForm.jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box } from '@mui/material';
import { z } from 'zod';

// Simple schema: two required fields
const testSchema = z.object({
  name: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required')
});

export default function TestForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(testSchema),
    defaultValues: { name: '', category: '' }
  });

  const onSubmit = (data) => {
    console.log('✅ onSubmit data:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {/* Plain MUI TextField */}
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      {/* MUI Select via Controller */}
      <FormControl fullWidth margin="normal" error={!!errors.category}>
        <InputLabel>Category</InputLabel>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select label="Category" {...field}>
              <MenuItem value="">— Select —</MenuItem>
              <MenuItem value="A">Option A</MenuItem>
              <MenuItem value="B">Option B</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.category?.message}</FormHelperText>
      </FormControl>

      {/* Native HTML button will also work */}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
