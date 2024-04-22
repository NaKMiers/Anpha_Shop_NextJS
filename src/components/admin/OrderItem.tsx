import { FullyOrder } from '@/app/api/user/order-history/route'
import { deliverOrderApi, reDeliverOrder } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime, isToday } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheckSquare, FaEye, FaHistory, FaRegTrashAlt } from 'react-icons/fa'
import { GrDeliver } from 'react-icons/gr'
import { ImCancelCircle } from 'react-icons/im'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'

interface OrderItemProps {
  data: FullyOrder
  loadingOrders: string[]
  className?: string

  setOrders: React.Dispatch<React.SetStateAction<FullyOrder[]>>
  selectedOrders: string[]
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>

  handleCancelOrders: (ids: string[]) => void
  handleDeleteOrders: (ids: string[]) => void
}

function OrderItem({
  data,
  loadingOrders,
  className = '',

  // selected
  setOrders,
  selectedOrders,
  setSelectedOrders,

  // functions
  handleCancelOrders,
  handleDeleteOrders,
}: OrderItemProps) {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'deliver' | 're-deliver' | 'delete'>('delete')
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // handle deliver order
  const handleDeliverOrder = useCallback(async () => {
    // start loading
    setIsLoading(true)

    try {
      // send request to deliver order
      const { message } = await deliverOrderApi(data._id)

      // update order status
      setOrders(prev => prev.map(o => (o._id === data._id ? { ...o, status: 'done' } : o)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [data._id, setOrders])

  // handle re-deliver order
  const handleReDeliverOrder = useCallback(async () => {
    // start loading
    setIsLoading(true)

    try {
      // send request to re-deliver order
      const { message } = await reDeliverOrder(data._id)

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [data._id])

  return (
    <>
      <div
        className={`relative w-full flex justify items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
          selectedOrders.includes(data._id)
            ? 'bg-violet-50 -translate-y-1'
            : data.status === 'done'
            ? 'bg-green-100'
            : data.status === 'pending'
            ? 'bg-red-100'
            : 'bg-slate-200'
        }  ${className}`}
        onClick={() =>
          setSelectedOrders(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div className='w-[calc(100%_-_44px)]'>
          {/* MARK: Thumbnails */}
          <div className='w-full h-full flex items-center flex-wrap gap-2 mb-2 max-h-[145px] overflow-y-auto '>
            {data.items.map((item: any) => (
              <Link
                href={`/${item.product.slug}`}
                prefetch={false}
                className='relative rounded-lg shadow-md overflow-hidden'
                onClick={e => e.stopPropagation()}
                key={item._id}>
                <Image
                  className='aspect-video'
                  src={item.product.images[0] || '/images/not-found.jpg'}
                  height={120}
                  width={120}
                  alt='thumbnail'
                />
                <span className='py-[2px] px-[3px] rounded-full absolute top-1 right-1 bg-secondary shadow-md text-[8px] font-semibold text-light border-2 border-white'>
                  x{item.quantity}
                </span>
              </Link>
            ))}
          </div>

          {/* MARK: Information */}
          <div className='flex gap-2 flex-wrap items-center'>
            {/* Status */}
            <p
              className={`inline font-semibold text-${
                data.status === 'done' ? 'green' : data.status === 'pending' ? 'red' : 'slate'
              }-400`}
              title='status'>
              {data.status}
            </p>

            {/* Code */}
            <p className='inline font-semibold text-primary' title='code'>
              {data.code}
            </p>

            {/* Method */}
            <p
              className={`inline font-semibold text-[${
                data.paymentMethod === 'momo' ? '#a1396c' : '#399162'
              }]`}
              title='payment-method'>
              {data.paymentMethod}
            </p>

            {/* UserID */}
            <FaCheckSquare
              title='userId'
              size={18}
              className={`${data.userId ? 'text-green-500' : 'text-slate-600'}`}
            />
          </div>

          {/* Email */}
          <p className='block underline text-ellipsis line-clamp-1' title={'Email: ' + data.email}>
            {data.email}
          </p>

          {/* Total */}
          <p
            className='flex items-center flex-wrap gap-x-2 mr-2 text-green-500 text-xl font-semibold'
            title='total'>
            {formatPrice(data.total)}{' '}
            <span
              className='px-[7px] py-[1px] text-center text-xs rounded-full shadow-sm bg-sky-300 text-white'
              title='quantity'>
              x{data.items.reduce((quantity: number, item: any) => quantity + item.quantity, 0)}
            </span>
          </p>

          {data.voucherApplied && data.discount && (
            <p
              className='font-semibold text-slate-400 text-sm'
              title={`voucherApplied: ${data.voucherApplied.desc}`}>
              {data.voucherApplied.code}{' '}
              <span className='text-secondary font-normal'>({formatPrice(data.discount)})</span>
            </p>
          )}

          {/* Created */}
          <div className='flex flex-wrap gap-x-2'>
            <p className='text-sm' title='Created (d/m/y)'>
              <span className='font-semibold'>Created: </span>
              <span className={isToday(new Date(data.createdAt)) ? 'font-semibold text-slate-600' : ''}>
                {formatTime(data.createdAt)}
              </span>
            </p>

            {/* Updated */}
            <p className='text-sm' title='Updated (d/m/y)'>
              <span className='font-semibold'>Updated: </span>
              <span>{formatTime(data.updatedAt)}</span>
            </p>
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col flex-shrink-0 border bg-white border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Detail Button */}
          <Link
            href={`/admin/order/${data.code}`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Detail'>
            <FaEye size={18} className='text-primary group-hover:scale-125 common-transition' />
          </Link>

          {/* Deliver Button */}
          {data.status !== 'done' && (
            <button
              className='block group'
              disabled={loadingOrders.includes(data._id) || isLoading}
              onClick={e => {
                e.stopPropagation()
                setConfirmType('deliver')
                setIsOpenConfirmModal(true)
              }}
              title='Deliver'>
              {isLoading ? (
                <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
              ) : (
                <GrDeliver
                  size={18}
                  className='text-yellow-400 group-hover:scale-125 common-transition'
                />
              )}
            </button>
          )}

          {/* Re-Deliver Button */}
          {data.status === 'done' && (
            <button
              className='block group'
              disabled={loadingOrders.includes(data._id) || isLoading}
              onClick={e => {
                e.stopPropagation()
                setConfirmType('re-deliver')
                setIsOpenConfirmModal(true)
              }}
              title='Re-Deliver'>
              {isLoading ? (
                <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
              ) : (
                <FaHistory size={18} className='text-blue-500 group-hover:scale-125 common-transition' />
              )}
            </button>
          )}

          {/* Cancel Button */}
          {data.status === 'pending' && (
            <button
              className='block group'
              disabled={loadingOrders.includes(data._id) || isLoading}
              onClick={e => {
                e.stopPropagation()
                handleCancelOrders([data._id])
              }}
              title='Cancel'>
              <ImCancelCircle
                size={18}
                className='text-slate-300 group-hover:scale-125 common-transition'
              />
            </button>
          )}

          {/* Delete Button */}
          <button
            className='block group'
            disabled={loadingOrders.includes(data._id) || isLoading}
            onClick={e => {
              e.stopPropagation()
              setConfirmType('delete')
              setIsOpenConfirmModal(true)
            }}
            title='Delete'>
            {loadingOrders.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaRegTrashAlt
                size={18}
                className='group-hover:scale-125 common-transition text-rose-500'
              />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Order`}
        content={`Are you sure that you want to ${confirmType} this order?`}
        onAccept={() =>
          confirmType === 'deliver'
            ? handleDeliverOrder()
            : confirmType === 're-deliver'
            ? handleReDeliverOrder()
            : handleDeleteOrders([data._id])
        }
        isLoading={loadingOrders.includes(data._id) || isLoading}
        color={confirmType === 'deliver' ? 'yellow' : confirmType === 're-deliver' ? 'sky' : 'rose'}
      />
    </>
  )
}

export default OrderItem
