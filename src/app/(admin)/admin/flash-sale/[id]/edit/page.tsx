'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IProduct } from '@/models/ProductModel'
import axios from 'axios'
import { timeStamp } from 'console'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft } from 'react-icons/fa'
import { FaPause, FaPlay } from 'react-icons/fa6'
import { IoReload } from 'react-icons/io5'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddFlashSalePage() {
  // hook
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // states
  const [flashSale, setFlashSale] = useState<IProduct | null>(null)
  const [products, setProducts] = useState<IProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [timeType, setTimeType] = useState<'loop' | 'once'>('loop')

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      type: 'percentage',
      value: '',
      begin: new Date().toISOString().split('T')[0],
      expire: '',
      timeType: 'loop',
      duration: 120,
    },
  })

  // get flash sale by id
  useEffect(() => {
    const getProduct = async () => {
      try {
        // send request to server to get product
        const res = await axios.get(`/api/admin/flash-sale/${id}`)
        const { flashSale, message } = res.data

        // set product to state
        console.log(res.data)
        setFlashSale(flashSale)

        // // set value to form
        setValue('type', flashSale.type)
        setValue('value', flashSale.value)
        setValue('begin', new Date(flashSale.begin).toISOString().split('T')[0])
        setValue('expire', new Date(flashSale.expire).toISOString().split('T')[0])
        setValue('duration', flashSale.duration)
        setValue('timeType', flashSale.timeType)
        setTimeType(flashSale.timeType)

        setSelectedProducts(flashSale.products.map((product: IProduct) => product._id))
      } catch (err: any) {
        console.log('err:', err)
        toast.error(err.response.data.message)
      }
    }
    getProduct()
  }, [id, setValue])

  // get all products to apply
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        // send request to server
        const res = await axios.get('/api/admin/product/all')
        console.log(res.data)

        // set products to state
        setProducts(res.data.products)
      } catch (err: any) {
        console.error(err)
        toast.error(err.response.data.message)
      }
    }
    getAllProducts()
  }, [])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      if (data.type === 'percentage' && !data.value.endsWith('%')) {
        setError('value', { type: 'manual', message: 'Value must have %' })
        isValid = false
      }

      // if type if percentage, value have '%' at the end and must be number
      if (data.type === 'percentage' && isNaN(Number(data.value.replace('%', '')))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if type if fixed-reduce, value must be number
      if (data.type !== 'percentage' && isNaN(Number(data.value))) {
        setError('value', { type: 'manual', message: 'Value must be number' })
        isValid = false
      }

      // if time type is loop, duration must be > 0
      if (data.timeType === 'loop' && data.duration <= 0) {
        setError('duration', { type: 'manual', message: 'Duration must be > 0' })
        isValid = false
      }

      // if expire is less than begin
      if (new Date(data.expire).getTime() <= new Date(data.begin).getTime()) {
        setError('expire', { type: 'manual', message: 'Expire must be > begin' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // handle send request to server to add flash sale
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    console.log(data)

    // set loading
    dispatch(setLoading(true))

    try {
      // send request to server
      const res = await axios.put(`/api/admin/flash-sale/${id}/edit`, {
        ...data,
        appliedProducts: selectedProducts,
      })
      console.log(res)

      // show success message
      toast.success(res.data.message)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response.data.message)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          Edit Flash Sale
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/flash-sale/all'>
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className='pt-5' />

      <div>
        {/* Type */}
        <Input
          id='type'
          label='Type'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='select'
          options={[
            {
              label: 'Percentage',
              value: 'percentage',
              selected: true,
            },
            {
              label: 'Fixed-Reduce',
              value: 'fixed-reduce',
              selected: false,
            },
            {
              label: 'Fixed',
              value: 'fixed',
              selected: false,
            },
          ]}
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        {/* Value */}
        <Input
          id='value'
          label='Value'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={MdNumbers}
          className='mb-5'
        />

        {/* Begin */}
        <Input
          id='begin'
          label='Begin'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='date'
          icon={FaPlay}
          className='mb-5'
        />

        <div className='grid grid-col-1 lg:grid-cols-2 gap-5 mb-5'>
          {/* Time Type */}
          <Input
            id='timeType'
            label='Time Type'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            onChange={e => {
              console.log(2132)
              setValue('timeType', e.target.value)
              setTimeType(e.target.value as 'loop' | 'once')
            }}
            options={[
              {
                label: 'Loop',
                value: 'loop',
                selected: true,
              },
              {
                label: 'Once',
                value: 'once',
                selected: false,
              },
            ]}
            icon={RiCharacterRecognitionLine}
          />

          {timeType === 'loop' && (
            <Input
              id='duration'
              label='Duration'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='number'
              icon={IoReload}
            />
          )}
          {timeType === 'once' && (
            <Input
              id='expire'
              label='Expire'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaPause}
            />
          )}
        </div>

        {/* Ready to apply products */}
        <p className='text-light font-semibold text-xl mb-1'>Select Products</p>

        <div className='flex flex-wrap rounded-lg bg-white p-3 gap-2 mb-5'>
          {products.map(product => (
            <div
              className={`border-2 border-slate-300 rounded-lg flex items-center p-2 gap-2 cursor-pointer common-transition ${
                selectedProducts.includes(product._id) ? 'bg-secondary border-white text-white' : ''
              }`}
              onClick={() =>
                selectedProducts.includes(product._id)
                  ? setSelectedProducts(prev => prev.filter(id => id !== product._id))
                  : setSelectedProducts(prev => [...prev, product._id])
              }
              key={product._id}>
              <Image
                className='aspect-video rounded-md border-2 border-white'
                src={product.images[0]}
                height={60}
                width={60}
                alt='thumbnail'
              />
              <span>{product.title}</span>
            </div>
          ))}
        </div>

        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Save'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddFlashSalePage
