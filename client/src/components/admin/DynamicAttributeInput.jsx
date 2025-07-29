// components/admin/DynamicAttributeInput.jsx
import React from 'react';
import { TextField, Checkbox, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const DynamicAttributeInput = ({ dataType, value, onChange, error, helperText }) => {
  switch (dataType) {
    case 'string':
      return (
        <TextField
          fullWidth
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          helperText={helperText}
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(Number(e.target.value))}
          error={error}
          helperText={helperText}
        />
      );

    case 'boolean':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{value ? 'Yes' : 'No'}</span>
        </Box>
      );

    case 'date':
      return (
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(newValue) =>
            onChange(newValue ? newValue.toISOString() : null)
          }
          slotProps={{
            textField: {
              fullWidth: true,
              error: error,
              helperText: helperText,
            },
          }}
        />
      );

    default:
      return null;
  }
};

export default DynamicAttributeInput;
