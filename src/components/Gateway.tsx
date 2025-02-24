import { admins } from '@/constants'
import useUtils from '@/libs/useUtils'
import { IAccount } from '@/models/AccountModel'
import { IOrder, TPaymentMethod } from '@/models/OrderModel'
import { IVoucher } from '@/models/VoucherModel'
import { checkOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import moment from 'moment'
import Image from 'next/image'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { FaCopy } from 'react-icons/fa'
import { IoIosHelpCircle, IoMdQrScanner } from 'react-icons/io'
import { TbLoader2 } from 'react-icons/tb'
import CartItem from './CartItem'
import Countdown from './Countdown'
import Divider from './Divider'

interface GatewayProps {
  checkout: IOrder & { orderId: string }
  type: TPaymentMethod
  className?: string
}

function Gateway({ checkout, type, className = '' }: GatewayProps) {
  // hooks
  const { handleCopy } = useUtils()

  // states
  const [loaded, setLoaded] = useState<boolean>(false)
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number[]>([0, 0, 0])
  const [stopped, setStopped] = useState<boolean>(false)
  const [order, setOrder] = useState<IOrder | null>(null)

  // values
  const admin = admins[(process.env.NEXT_PUBLIC_ADMIN! as keyof typeof admins) || 'KHOA']
  const gatewayTime = 10 // minutes

  useEffect(() => {
    const addedTime = moment(checkout.createdAt).add(gatewayTime, 'minutes').toDate()
    const now = moment().toDate()

    if (addedTime.getTime() < now.getTime()) {
      setStopped(true)
    } else {
      const duration = moment.duration(moment(addedTime).diff(now))
      console.log('[Gateway] Time left:', duration.hours(), duration.minutes(), duration.seconds())
      setTimeLeft([duration.hours(), duration.minutes(), duration.seconds()])
    }

    setLoaded(true)
  }, [checkout])

  // check order every 5 seconds
  useEffect(() => {
    const checkOrder = async () => {
      try {
        const { order } = await checkOrderApi(checkout.orderId)
        console.log('Order:', order)
        setOrder(order)
      } catch (err: any) {
        console.error(err)
      } finally {
        setInitialLoaded(true)
      }
    }

    if (!order && !stopped) {
      checkOrder()
    }

    const interval = setInterval(() => {
      // if stopped or order is done
      if (stopped || order?.status === 'done') {
        clearInterval(interval)
      } else {
        checkOrder()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [checkout.orderId, stopped, order])

  return initialLoaded ? (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Countdown */}
      {checkout?.createdAt && (
        <div
          className={`flex items-center justify-center gap-2 rounded-t-md ${stopped && !order ? 'bg-rose-600' : order ? 'bg-green-500' : 'bg-dark-100'} px-4 py-1 text-sm text-light`}
        >
          {stopped && !order ? (
            <span>Đã hết thời gian thanh toán</span>
          ) : order ? (
            <span>Thanh toán thành công</span>
          ) : (
            <>
              <span>Đơn hàng hạn sau:</span>
              {loaded && (
                <Countdown
                  minutes={timeLeft[1]}
                  seconds={timeLeft[2]}
                  onCompleted={() => setStopped(true)}
                  className="-mb-1.5"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Gateway Body */}
      <div className="relative w-full rounded-lg border-2 border-dark px-21/2 py-21 md:px-21">
        <h1
          className={`text-center text-lg font-semibold ${type === 'momo' ? 'text-[#a1396c]' : 'text-[#399162]'} md:text-start`}
        >
          {type === 'momo' ? 'Thanh toán qua Momo' : 'Thanh toán qua Ngân hàng'}
        </h1>

        {!stopped && !order ? (
          <div className="flex flex-col gap-21">
            <div className="flex w-full flex-col justify-between gap-21 md:flex-row md:items-center">
              {/* QR */}
              <div className="flex items-center justify-center rounded-md p-21 shadow-md">
                <div className="h-full max-h-[200px] w-full max-w-[200px] overflow-hidden rounded-md shadow-lg md:max-h-[300px] md:max-w-[300px]">
                  {type === 'momo' ? (
                    <Image
                      className="h-full w-full object-contain"
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=440x440&data=2|99|${admin.momo.account}|||0|0|${checkout?.total}|${checkout?.code}|transfer_p2p`}
                      width={500}
                      height={500}
                      alt="momo-qr"
                    />
                  ) : (
                    <>
                      <Image
                        className="h-full w-full object-contain"
                        src={`https://img.vietqr.io/image/970436-1040587211-eeua38J.jpg?amount=${
                          checkout?.total
                        }&addInfo=${encodeURI(checkout?.code)}&accountName=${admin.banking.receiver}`}
                        width={500}
                        height={500}
                        alt="banking-qr"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1">
                {/* Steps */}
                <ul className="font-body tracking-wider">
                  <li>
                    <span className="font-semibold">Bước 1:</span> Mở ứng dụng{' '}
                    {type === 'momo' ? 'Momo' : 'ngân hàng'} của bạn
                  </li>
                  <li>
                    <span className="font-semibold">Bước 2:</span> Chọn{' '}
                    <IoMdQrScanner
                      className="inline"
                      size={18}
                    />{' '}
                    Scan QR
                  </li>
                  <li>
                    <span className="font-semibold">Bước 3:</span> Xác nhận thanh toán trên ứng dụng
                  </li>
                </ul>

                <Divider
                  size={5}
                  border
                />

                {/* Manual */}
                <p className="mb-0.5 font-body text-sm tracking-wider">Hoặc chuyển khoản thủ công:</p>
                <div className="flex flex-col gap-0.5 rounded-md border border-slate-400 p-2 text-sm">
                  {type === 'banking' && (
                    <div className="justify flex items-center gap-2 font-body tracking-wide">
                      <span>Ngân hàng:</span>
                      <button
                        className="flex justify-center overflow-hidden rounded-sm border border-dark text-[#399162]"
                        onClick={() => handleCopy(admin.banking.name)}
                      >
                        <span className="px-2">{admin.banking.name}</span>
                        <div className="flex items-center justify-center bg-dark-100 px-1.5 text-light">
                          <FaCopy size={14} />
                        </div>
                      </button>
                    </div>
                  )}
                  {type === 'momo' ? (
                    <div className="justify flex items-center gap-2 text-nowrap font-body tracking-wide">
                      <span>Số tài khoản Momo:</span>
                      <button
                        className="flex justify-center overflow-hidden rounded-sm border border-dark text-[#a1396c]"
                        onClick={() => handleCopy(admin.momo.account)}
                      >
                        <span className="px-2">{admin.momo.account}</span>
                        <div className="flex items-center justify-center bg-dark-100 px-1.5 text-light">
                          <FaCopy size={14} />
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="justify flex items-center gap-2 font-body tracking-wide">
                      <span>Số tài khoản Ngân hàng:</span>
                      <button
                        className="flex justify-center overflow-hidden rounded-sm border border-dark text-[#a1396c]"
                        onClick={() => handleCopy(admin.banking.account)}
                      >
                        <span className="px-2">{admin.banking.account}</span>
                        <div className="flex items-center justify-center bg-dark-100 px-1.5 text-light">
                          <FaCopy size={14} />
                        </div>
                      </button>
                    </div>
                  )}
                  {checkout?.total >= 0 && (
                    <div className="justify flex items-center gap-2 text-nowrap font-body tracking-wide">
                      <span>Số tiền:</span>
                      <button
                        className="flex justify-center overflow-hidden rounded-sm border border-dark text-green-500"
                        onClick={() => handleCopy(checkout.total.toString())}
                      >
                        <span className="px-2">{formatPrice(checkout?.total)}</span>
                        <div className="flex items-center justify-center bg-dark-100 px-1.5 text-light">
                          <FaCopy size={14} />
                        </div>
                      </button>
                    </div>
                  )}
                  {checkout?.code && (
                    <div className="justify flex items-center gap-2 text-nowrap font-body tracking-wide">
                      <span>Nội dung:</span>
                      <button
                        className="flex justify-center overflow-hidden rounded-sm border border-dark text-yellow-500"
                        onClick={() => handleCopy(checkout?.code)}
                      >
                        <span className="px-2">{checkout?.code}</span>
                        <div className="flex items-center justify-center bg-dark-100 px-1.5 text-light">
                          <FaCopy size={14} />
                        </div>
                      </button>
                    </div>
                  )}
                  {type === 'momo' && (
                    <a
                      href="https://me.momo.vn/anphashop"
                      className="font-body text-sm tracking-wide"
                    >
                      Chuyển nhanh:{' '}
                      <span className="text-sm text-[#a1396c] underline">Link thanh toán bằng Momo</span>
                    </a>
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                  <IoIosHelpCircle size={20} /> Ấn để sao chép
                </p>
              </div>
            </div>

            <div
              className={`flex items-center justify-center gap-2 ${type === 'momo' ? 'text-[#a1396c]' : 'text-[#399162]'}`}
            >
              <TbLoader2
                size={22}
                className="animate-spin"
              />
              <p className="text-center font-body font-semibold tracking-wider">
                Đang chờ bạn thanh toán...
              </p>
            </div>

            <div className="h-px border-t border-slate-200" />

            <div className="flex items-center justify-center gap-2">
              <p className="text-center font-body tracking-wider">
                Bạn sẽ nhận được đơn tài khoản sau khi thanh toán. Vui lòng không rời trang.
              </p>
            </div>
          </div>
        ) : order ? (
          <div className="mt-2">
            <OrderInfo order={order} />
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-3">
            <OrderInfo order={{ ...checkout, paymentMethod: type }} />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="loading min-h-[400px] w-full rounded-lg" />
  )
}

export default Gateway

interface OrderInfoProps {
  order: IOrder
  className?: string
}

function OrderInfo({ order, className = '' }: OrderInfoProps) {
  // hooks
  const { handleCopy } = useUtils()

  const totalQuantity: number = useMemo(
    () => order?.items.reduce((total, item) => total + item.quantity, 0),
    [order]
  )

  return (
    <div className={`rounded-medium border px-21/2 py-4 ${className}`}>
      {/* MARK: Head Info */}
      <div className="flex flex-wrap items-center justify-between gap-x-3">
        <div>
          <span className="font-semibold">Mã hóa đơn: </span>
          <span className="font-semibold text-primary">{order.code}</span>
        </div>
        <div>
          <span className="font-semibold">Ngày đặt hàng: </span>
          <span>{formatTime(order.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3">
        <div>
          <span className="font-semibold">Trạng thái: </span>
          <span
            className={
              order.status === 'pending'
                ? 'text-yellow-500'
                : order.status === 'cancel'
                  ? 'text-slate-400'
                  : order.status === 'done'
                    ? 'text-green-500'
                    : ''
            }
          >
            {order.status === 'pending'
              ? 'Đang xử lí'
              : order.status === 'cancel'
                ? 'Đã hủy'
                : order.status === 'done'
                  ? 'Hoàn tất'
                  : ''}
          </span>
        </div>
        <div>
          <span className="font-semibold">Phương thức thanh toán: </span>
          <span
            className={`font-semibold ${
              order.paymentMethod === 'momo' ? 'text-[#a1396c]' : 'text-green-600'
            }`}
          >
            {order.paymentMethod.toUpperCase()}
          </span>
        </div>
      </div>

      {order.voucherApplied && (
        <div className="flex flex-wrap items-center justify-between gap-x-3">
          <div>
            <span className="font-semibold">Voucher: </span>
            <span
              title={(order.voucherApplied as IVoucher).desc}
              className="font-semibold text-slate-400"
            >
              {(order.voucherApplied as IVoucher).code}
            </span>
          </div>
          <div>
            <span className="font-semibold">Giảm giá: </span>
            <span className="text-secondary">{formatPrice(order.discount)}</span>
          </div>
        </div>
      )}

      {/* Product */}
      {order.status === 'done' && (
        <>
          <h3 className="mb-4 mt-6 text-2xl font-semibold">Sản phẩm ({totalQuantity})</h3>

          {order?.items.map(item => (
            <div
              className="relative mb-5 pl-21/2"
              key={item.product._id}
            >
              <div className="absolute left-0 top-1/2 h-[88%] w-px -translate-y-1/2 bg-slate-200" />

              <div className="relative rounded-medium border border-slate-300 p-21/2 shadow-lg">
                <CartItem
                  cartItem={item}
                  isCheckout
                  localCartItem
                  isOrderDetailProduct
                />

                {/* Adjustments */}

                {item.accounts.map((account: IAccount) => (
                  <Fragment key={account._id}>
                    <hr className="mb-3 mt-5" />

                    <div className="relative">
                      <button
                        className="group absolute right-1.5 top-1.5 z-10 rounded-md border bg-white p-1.5 text-slate-500"
                        onClick={e => {
                          e.stopPropagation()
                          handleCopy(account.info)
                        }}
                      >
                        <FaCopy
                          size={16}
                          className="wiggle"
                        />
                      </button>

                      <div className="relative mt-2 max-h-[200px] w-full overflow-auto whitespace-pre break-all rounded-xl border border-slate-300 p-4 font-body text-sm tracking-wide">
                        {account.info.split('\n').map((line, index) => (
                          <span
                            key={index}
                            className="block"
                          >
                            {line.split(' ').map((word, index) => (
                              <span
                                key={index}
                                className="inline-block cursor-pointer"
                                onClick={() => handleCopy(word)}
                              >
                                {word}{' '}
                              </span>
                            ))}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                ))}

                {order.status === 'done' && (
                  <p className="mt-2 flex items-center gap-1 text-slate-500">
                    <IoIosHelpCircle size={20} /> Ấn để sao chép từng phần
                  </p>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
