import React, { useState, useEffect } from 'react'

import { Delete, Add, CloudUpload } from '@mui/icons-material'
import { useSelector } from 'react-redux'

import { productFormSchema } from '../../utils/zodProductValidation'

import { useForm, useFieldArray } from 'react-hook-form'
import { TextField } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import DynamicAttributeInput from "./DynamicAttributeInput"

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
    alert('Form is submitted ')
    console.log(data)
  }

  return (
    <div className=' shadow-black space-y-12 p-10 bg-slate-50'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-12 container justify-self-center'>
        {/* Title SKU Short and Detailed description */}
        <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
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
              {...register('description.short' , {maxLength : 200})}
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
        <div className='grid md:grid-cols-4 grid-col-11 gap-10 text-sm lg:text-xl bg-white p-5 pb-20 rounded-2xl drop-shadow-2xl shadow-blue-950'>
            <label className='col-span-full'>Dimension</label>
            
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

        <div className='grid lg:grid-cols-1 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
            <div className="grid lg:grid-cols-4  grid-cols-1">
              <label className="lg:col-span-full ">Categories</label>
              {categoryFields.map((item, index) => (
                <div key={item.id} className='flex items-center text-sm gap-2 mr-10 my-2'>
                  <input
                    {...register(`categories.${index}`)}
                    className='border px-2 py-1 lg:w-4/5 w-9/10 rounded'
                  />
                  <button type='button' className="" onClick={() => removeCategory(index)}>
                    ❌
                  </button>
                </div>
              ))}
              <button type='button' onClick={() => appendCategory('')}>
                <Add /> Categories
              </button>
            </div>
        </div>

        <div className='grid lg:grid-cols-1 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          <div >
            <label className='col-span-full'>Color Variants</label>
            {colorFields.map((item, index) => (
              <div
                key={item.id}
                className='flex items-center gap-4 my-4 items-center'
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
                <button
                type='button'
                onClick={() => appendColor({ color: '', hex: '' })}
                >
                <Add/>
                Color
                </button>
            </div>
          </div>
        </div>

        {/* {dynamicAttributes} */}
        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
            <label className='col-span-full'>Dynamic Attributes</label>
  {attributeFields.map((field, index) => (
    <div key={field.id} className='flex flex-col gap-2 border p-4 rounded-md bg-slate-100'>
      <input
        placeholder="Attribute Name"
        {...register(`dynamicAttributes.${index}.name`)}
        className='border px-2 py-1 rounded'
      />
      <select
        {...register(`dynamicAttributes.${index}.dataType`)}
        className='border px-2 py-1 rounded'
      >
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="date">Date</option>
      </select>

      {/* Dynamically render input by watching dataType */}
      <DynamicAttributeInput
        dataType={watch(`dynamicAttributes.${index}.dataType`)}
        value={watch(`dynamicAttributes.${index}.value`)}
        onChange={(val) => setValue(`dynamicAttributes.${index}.value`, val)}
      />

      <button
        type="button"
        onClick={() => removeAttribute(index)}
        className="text-red-500 text-sm underline w-fit"
      >
        Remove
      </button>
    </div>
  ))}
  <button
    type="button"
    onClick={() =>
      appendAttribute({ name: '', dataType: 'string', value: '' })
    }
    className='px-2 py-1 bg-blue-500 text-white rounded w-fit'
  >
    <Add /> Add Attribute
  </button>
        </div>

        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'></div>

        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'></div>

        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-xl bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'></div>

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
