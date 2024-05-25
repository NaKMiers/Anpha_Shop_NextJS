'use client'

import { FullyOrder } from '@/app/api/user/order-history/route'
import CartItem from '@/components/CartItem'
import Input from '@/components/Input'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IAccount } from '@/models/AccountModel'
import { editOrderApi, getOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import { useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCopy, FaSave } from 'react-icons/fa'
import { IoIosHelpCircle } from 'react-icons/io'
import { MdCancel, MdDateRange, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

function AdminOrderDetailPage({ params: { code } }: { params: { code: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()

  // states
  const [order, setOrder] = useState<FullyOrder | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      createdAt: '',
      email: '',
      total: 0,
    },
  })

  // MARK: Get Data
  // get order
  useEffect(() => {
    const getOrder = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { order } = await getOrderApi(code)

        // set order to state
        setOrder(order)

        // set form values
        reset({
          createdAt: new Date(order.createdAt).toISOString().slice(0, 16),
          email: order.email,
          total: order.total,
        })
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    if (code) {
      getOrder()
    }
  }, [dispatch, reset, code])

  // MARK: Save Order Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (order) {
        setIsSaving(true)

        try {
          console.log('data: ', data)
          const { updatedOrder, message } = await editOrderApi(order?._id, data)

          // updated order staet
          setOrder(updatedOrder)

          // show success
          toast.success(message)

          // turn off edit mode
          setEditMode(false)
        } catch (err: any) {
          toast.error(err.message)
          console.log(err)
        } finally {
          // reset loading state
          setIsSaving(false)
        }
      }
    },
    [order]
  )

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  return (
    <div className='bg-white py-21 px-4 rounded-medium shadow-medium-light'>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5 flex items-center justify-between'>
        <p>
          Order Detail: <span className='text-secondary font-sans'>{order?.code}</span>
        </p>
        <div className='flex items-center justify-center gap-2'>
          {editMode ? (
            <>
              <button
                className='flex items-center justify-center h-9 rounded-md px-2 border-2 border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-white common-transition'
                onClick={() => setEditMode(false)}>
                <MdCancel size={20} />
              </button>
              <button
                className={`flex items-center justify-center h-9 rounded-md px-2 border-2 hover:bg-rose-500 hover:text-white common-transition ${
                  isSaving
                    ? 'pointer-events-none border-slate-400 text-slate-400'
                    : 'border-rose-500 text-rose-500'
                }`}
                onClick={handleSubmit(onSubmit)}>
                {isSaving ? (
                  <RiDonutChartFill size={20} className='animate-spin' />
                ) : (
                  <FaSave size={20} />
                )}
              </button>
            </>
          ) : (
            <button
              className='flex items-center justify-center h-9 rounded-md px-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white common-transition'
              onClick={() => setEditMode(true)}>
              <MdEdit size={20} />
            </button>
          )}
        </div>
      </h1>

      {/* MARK: Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-5 items-start'>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Date: </span>
              {order && <span className=''>{formatTime(order.createdAt)}</span>}
            </>
          ) : (
            <Input
              id='createdAt'
              label='Date'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='datetime-local'
              icon={MdDateRange}
              className='my-1'
              onFocus={() => clearErrors('createdAt')}
            />
          )}
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Status: </span>
          <span className='font-semibold text-green-500'>{order?.status}</span>
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Email: </span>
              <span className='text-sky-500'>{order?.email}</span>
            </>
          ) : (
            <Input
              id='email'
              label='Email'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='email'
              icon={MdDateRange}
              className='my-1'
              onFocus={() => clearErrors('email')}
            />
          )}
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          {!editMode ? (
            <>
              <span className='font-semibold'>Total: </span>
              <span className='text-secondary font-semibold'>{formatPrice(order?.total)}</span>
            </>
          ) : (
            <Input
              id='total'
              label='Total'
              disabled={isSaving}
              register={register}
              errors={errors}
              required
              type='total'
              icon={MdDateRange}
              className='my-1'
              onFocus={() => clearErrors('total')}
            />
          )}
        </div>
        {order?.voucherApplied && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
            <span className='font-semibold'>Voucher: </span>
            <span className='text-slate-400 font-semibold' title={order?.voucherApplied.desc}>
              {order?.voucherApplied.code}
            </span>
          </div>
        )}
        {!!order?.discount && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
            <span className='font-semibold'>Giảm giá: </span>
            <span className='text-secondary font-semibold'>{formatPrice(order?.discount)}</span>
          </div>
        )}
      </div>

      {/* Product */}
      <h3 className='text-2xl font-semibold mb-4 mt-6'>
        Product{(order?.items.length || 0) > 1 ? 's' : ''}
      </h3>

      {/* MARK: Items */}
      {order?.items.map(item => (
        <div className='pl-21/2 relative mb-5' key={item.product._id}>
          <div className='absolute top-1/2 -translate-y-1/2 left-0 h-[88%] w-px bg-slate-200' />

          <div className='rounded-medium border border-slate-300 shadow-lg p-21/2'>
            <CartItem cartItem={item} isCheckout localCartItem isOrderDetailProduct />

            {order.status === 'done' ? (
              item.accounts.map((account: IAccount) => (
                <Fragment key={account._id}>
                  <hr className='mt-5 mb-3' />

                  <div className='relative'>
                    <button
                      className='group absolute z-10 top-1.5 right-1.5 rounded-md border p-1.5 text-slate-500 bg-white'
                      onClick={e => {
                        e.stopPropagation()
                        handleCopy(account.info)
                      }}>
                      <FaCopy size={16} className='wiggle' />
                    </button>

                    <div className='relative border border-slate-300 rounded-xl p-4 w-full mt-2 max-h-[200px] text-sm font-body tracking-wide overflow-auto whitespace-pre break-all'>
                      {account.info.split('\n').map((line, index) => (
                        <span key={index} className='block'>
                          {line.split(' ').map((word, index) => (
                            <span
                              key={index}
                              className='inline-block cursor-pointer'
                              onClick={e => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(word)
                                toast.success('Copied: ' + word)
                              }}>
                              {word}{' '}
                            </span>
                          ))}
                        </span>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))
            ) : (
              <p
                className={`mt-3 text-center italic ${
                  order.status === 'pending' ? 'text-yellow-500' : 'text-slate-400'
                } border-t border-slate-200 pt-2`}>
                {order.status}
              </p>
            )}

            {order.status === 'done' && (
              <p className='flex items-center gap-1 text-slate-500 mt-2'>
                <IoIosHelpCircle size={20} /> Ấn để sao chép từng phần
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminOrderDetailPage
