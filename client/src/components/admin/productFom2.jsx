import React, { useState, useEffect } from 'react'

import { Delete, Add, CloudUpload } from '@mui/icons-material'
import { useSelector } from 'react-redux'

import { productFormSchema } from '../../utils/zodProductValidation'

import { useForm, useFieldArray } from 'react-hook-form'
import { TextField } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import DynamicAttributeInput from './DynamicAttributeInput'

export default function ProductForm ({ initialData, onSuccess }) {
  const token = useSelector(state => state.auth.token)
  const { isSubmitting, setIsSubmitting } = useState(false)

  const [previews, setPreviews] = useState({
    primary: null,
    gallery: [],
    techincal: [],
    roomScences: []
  })

  const {
    control,
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {
      name: '',
      sku: '',
      description: {
        short: '',
        detailed: ''
      },
      categories: [],
      dimensions: { length: 0, width: 0, thickness: 0, unit: 'inch' },
      pricing: { basePrice: 0, currency: 'USD', minimumOrderQuantity: 1 },
      inventory: { quantity: 0, lowStockThreshold: 10 },
      isActive: true,
      isFeatured: false,
      supplier: { name: '', contactInfo: {}, leadTime: 14 },
      colorVariants: [],
      dynamicAttributes: []
    }
  })

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory
  } = useFieldArray({ control, name: 'categories' })

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor
  } = useFieldArray({ control, name: 'colorVariants' })

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute
  } = useFieldArray({ control, name: 'dynamicAttributes' })

  //     useEffect(()=>{
  //     if( initalData ) reset(initalData);
  // }, [initialData, reset]);

  const onSubmit = data => {
  }

  return (
    <div className=' shadow-black space-y-12 p-10 bg-slate-50'>
        {/* Title SKU Short and Detailed description */}
          <div className=' relative h-10'>
            <label for='name'>Title</label>
            <br />
            <input
              {...register('name', {
                required: 'title is required',
                minLength: 3
              })}
              type='text'
              className=' mt-2 px-2 min-w-full h-full border rounded-md border-amber-950'
              placeholder='title'
              name='name'
            />
            {errors?.name && (
              <p className='text-sm absolute lg:right-2 translate-x-10 -translate-y-20  lg:-translate-0'>
                {errors?.name?.message}
              </p>
            )}
          </div>
          <div className='h-10'>
            <label for='sku'>SKU</label>
            <br />
            <input
              {...register('sku')}
              type='text'
              className='min-w-full mt-2 px-2 h-full border rounded-md border-amber-950'
              placeholder='SKU'
              name='sku'
            />
          </div>
          <div className=''>
            <label for='short'>Short Describtion</label>
            <br />
            <textarea
              name='description.short'
              watch
              type='text'
              className='min-w-full mt-2 px-2 min-h-30 border rounded-md border-amber-950'
              placeholder='Short Description'
            ></textarea>
          </div>
          <div className=''>
            <label for='detailed'>Describtion</label>
            <br />
            <textarea
              name='description.detailed'
              {...register('description.detailed')}
              className='min-w-full mt-2 px-2 min-h-30 border rounded-md border-amber-950'
              placeholder='Description'
              resize='none'
            ></textarea>
          </div>
        </div>

        {/*Dimensions fields */}
          {['length', 'width', 'thickness'].map(d => (
            <div className='h-10'>
              <label for={`dimensions.${d}`}>{d}</label>
              <br />
              <input
                {...register(`dimensions.${d}`, { valueAsNumber: true })}
                type='number'
                className=' mt-2 px-2 w-full h-full border rounded-md border-amber-950'
                placeholder='title'
                name={`dimensions.${d}`}
                step={1}
              />
            </div>
          ))}
          <div className='h-10'>
            <label for='dimensions.unit'>unit</label>
            <br />
            <select
              name='dimensions.unit'
              className=' mt-2 px-2 w-1/2 h-full border rounded-md border-amber-950'
            >
              {['inch', 'mm', 'cm'].map(unit => (
                <option value={unit} key={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        </div>

            <label className='col-span-full'>Color Variants</label>
            {colorFields.map((item, index) => (
              <div
                key={item.id}
              >
                <input
                  placeholder='Color'
                  {...register(`colorVariants.${index}.color`)}
                  className='border px-2 py-1 w-2/3 rounded'
                />
                <input
                  placeholder='Hex Code'
                  {...register(`colorVariants.${index}.hex`)}
                  className='border w-10px'
                  type='color'
                />
                <button type='button' onClick={() => removeColor(index)}>
                  ❌
                </button>
              </div>
            ))}
            <div>
                type='button'
                onClick={() => appendColor({ color: '', hex: '' })}
                Color
            </div>
          </div>
        </div>

        {/* {dynamicAttributes} */}


        </div>




        <div className='relative min-w-full border text-right'>
          <button
            type='submit'
            varient='contained'
            disabled={isSubmitting}
            className='px-4 py-1  border m-4 bg-blue-400 rounded-md text-white h-10 w-30 drop-shadow-2xl '
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
// 2 reset form when editing
