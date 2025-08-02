import React, { useState, useEffect } from 'react'

import { Delete, Add, CloudUpload } from '@mui/icons-material'
import { useSelector } from 'react-redux'

import { productFormSchema } from '../../utils/zodProductValidation'

import { useForm, useFieldArray } from 'react-hook-form'
import { TextField } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import DynamicAttributeInput from './DynamicAttributeInput'
import api from '../../utils/axiosInterceptor'
import { number } from 'zod'


export default function ProductForm({ initialData, onSuccess }) {

  const token = useSelector(state => state.auth.token)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState({
    primary: null,
    gallery: [],
    technical: [],
    roomScenes: []
  })

  const [previews, setPreviews] = useState({
    primary: null,
    gallery: [],
    technical: [],
    roomScenes: []
  })

  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
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
      inventory: { quantity: 1, lowStockThreshold: 10 },
      isActive: true,
      isFeatured: false,
      supplier: { name: 'Aman', contactInfo: {phone: "+917877650647"}, leadTime: 14 },
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

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);
  // File change handler


  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => ({
      ...prev,
      [type]: type === 'primary' ? selectedFiles[0] : selectedFiles
    }));

    ///Generate Previews
    if( selectedFiles.length === 0){
      setPreviews(prev=>({
        ...prev,
        [type] : type === 'primary' ? null : []
      }));
      return ;
    }
    
    if(type === 'primary'){
      const previewURL = URL.createObjectURL(selectedFiles[0]);
      setPreviews(prev => ({ ...prev, primary : previewURL}));
    }

    else{
      const previewURLs = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => ( { ...prev , [type] : previewURLs}));
    }

  }

  //on Submit
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    // Append all form fields (except files)
    Object.entries(data).forEach(([key, value]) => {

      if( value === undefined || value === null ) return ;

      if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value)); // for objects like nested attributres
      } else {
        formData.append(key, value);
      }
    });

    // Append files
    if (files.primary){
      formData.append('primary', files.primary);
    } 

    ['gallery' , 'technical', 'roomScenes'].forEach((type) =>{
      if( Array.isArray(files[type])) {
        files[type].forEach((file) => {
          if( file instanceof File ){
            formData.append(type, file);
          }
        });
      }
    })

    // Submit via Axios ( with my Axios Interceptor)
    console.log([...formData]);
    try {
    
      const response = await api.post('/products', formData,
                                     { headers: { 'Content-Type': 'multipart/form-data' ,
                                                   'Authorization': `Bearer ${token}` } });
      onSuccess?.(response.data);
      alert("Product Created Successfully");
    }
    catch(error){
      alert(error.response.data.message);
      console.error("Upload Failed ", error.response.data.message);
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className=' shadow-black space-y-12 p-10 bg-slate-50'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-12 container justify-self-center'
      >
        {/* Title SKU Short and Detailed description */}  
        <div className='grid md:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          <div className=' relative h-10'>
            <label htmlFor='name'>Title</label>
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
              {...register('description.short', { maxLength: 200 })}

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
        

        {/* Pricing */}

        <div className='text-sm lg:text-md bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          <div className='flex sm:w-1 lg:min-w-1/2 gap-10 h-10'>
            <input type='number' 
            name='pricing.basePrice'
            step={watch('pricing.currency') === 'INR'? 1 : 0.1 }
            {...register('pricing.basePrice')}
            className=' mt-2 px-2 w-full h-full border rounded-md border-amber-950'
            />
            <select
            name='pricing.currency'
            {...register('pricing.currency')}
            className=' mt-2 px-2 w-full h-full border rounded-md border-amber-950'
            >
              {
                ['USD', 'EUR', 'GBP' , 'INR'].map((currency) =>(
                  <option value={currency}
                  >{currency}</option>
                ))
              }
            </select>

          </div>
        </div>


        {/*Dimensions fields */}
        <div className='grid md:grid-cols-4 grid-col-11 gap-10 text-sm lg:text-md bg-white p-5 pb-20 rounded-2xl drop-shadow-2xl shadow-blue-950'>
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
              {...register(`dimensions.unit`)}
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

        {/* categories */}
        <div className='grid lg:grid-cols-1 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          <div className='grid lg:grid-cols-4  grid-cols-1'>
            <label className='lg:col-span-full '>Categories</label>
            {categoryFields.map((item, index) => (
              <div
                key={item.id}
                className='flex items-center text-sm gap-2 mr-10 my-2'
              >
                <input
                  {...register(`categories.${index}`)}
                  className='border px-2 py-1 lg:w-4/5 w-9/10 rounded'
                />
                <button
                  type='button'
                  className=''
                  onClick={() => removeCategory(index)}
                >
                  ❌
                </button>
              </div>
            ))}
            <button type='button' className="text-left" onClick={() => appendCategory('')}>
              <Add /> Categories
            </button>
          </div>
        </div>
        
        {/* color Varients add more  */}
        <div className='grid lg:grid-cols-1 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          <div>
            <label className='col-span-full'>Color Variants</label>
            {colorFields.map((item, index) => (
              <div
                key={item.id}
                className='flex items-center gap-4 my-4 lg:w-1/2 w-fullitems-center'
              >
                <input
                  placeholder='Color'
                  {...register(`colorVariants.${index}.name`)}
                  className='border px-2 py-1 w-2/3 rounded'
                />
                <input
                  placeholder='Hex Code'
                  {...register(`colorVariants.${index}.hexCode`)}
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
                onClick={() => appendColor({ name: '', hexCode: '' })}
              >
                <Add />
                Color
              </button>
            </div>
          </div>
        </div>

        {/* {dynamicAttributes} */}
        <div className='grid lg:grid-cols-1 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-5 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          <label className='col-span-full'>Dynamic Attributes</label>
          {attributeFields.map((field, index) => (
            <div
              key={field.id}
              className='flex flex-col lg:flex-row gap-2 lg:w-1/2 w-full  rounded-md'
            >
              <input
                placeholder='Attribute Name'
                {...register(`dynamicAttributes.${index}.key`)}
                className='border px-2 py-1 rounded'
              />
              <select
                {...register(`dynamicAttributes.${index}.dataType`)}
                className='border px-2 py-1 rounded'
              >
                <option value='string'>String</option>
                <option value='number'>Number</option>
                <option value='boolean'>Boolean</option>
                <option value='date'>Date</option>
              </select>

              {/* Dynamically render input by watching dataType */}
              <DynamicAttributeInput
                dataType={watch(`dynamicAttributes.${index}.dataType`)}
                value={watch(`dynamicAttributes.${index}.value`)}
                onChange={val =>
                  setValue(`dynamicAttributes.${index}.value`, val)
                }
              />

              <button
                type='button'
                onClick={() => removeAttribute(index)}
                className='text-red-500 text-sm underline w-fit'
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={() =>
              appendAttribute({ key: '', dataType: 'string', value: '' })
            }
            className='px-2 py-1 bg-blue-500 text-white rounded w-fit'
          >
            <Add /> Add Attribute
          </button>
        </div>

        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'>
          {['primary', 'gallery', 'technical', 'roomScenes'].map((type) => (
            <div key={type}>
              <label htmlFor={type}>
                <CloudUpload /> {type}
              </label><br />
              <input
                type="file"
                id={type}
                hidden
                multiple={type !== 'primary'}
                onChange={e => handleFileChange(e, type)}
              />

              <div className="text-xs mt-1">
                {type === 'primary' && previews.primary && (
                  <img src={previews.primary} alt="Primary Preview" className="h-20 mt-2" />
                )}
                {type !== 'primary' && previews[type] && previews[type].length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previews[type].map((src, idx) => (
                      <img key={idx} src={src} alt={`${type} preview ${idx}`} className="h-16" />
                    ))}
                  </div>
                )}
              </div>

              <label htmlFor={type} className="cursor-pointer px-2 py-1 border rounded bg-gray-100 inline-block mt-2">
                Upload {type}
              </label>
              {/* Show selected file names */}
              <div className="text-xs mt-1">
                {type === 'primary' && files.primary && <span>{files.primary.name}</span>}
                {type !== 'primary' && files[type] && files[type].length > 0 && (
                  <ul>
                    {files[type].map((file, idx) => <li key={idx}>{file.name}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

          {/* product Pricing  */}
        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'></div>

        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-10 text-sm lg:text-md bg-white p-10 rounded-2xl drop-shadow-2xl shadow-blue-950'></div>

        <div className='relative min-w-full border text-right'>
          <button
            type='submit'
            varient='contained'
            disabled={isSubmitting}
            className='px-4 py-1  border m-4 bg-blue-400 rounded-md text-white h-10 w-30 drop-shadow-2xl '
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  )
}
// 2 reset form when editing
