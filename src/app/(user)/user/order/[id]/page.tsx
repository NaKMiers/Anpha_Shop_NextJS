import CartItem from '@/components/CartItem'
import React from 'react'

function OrderDetailPage() {
  return (
    <div>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>CHI TIẾT HÓA ĐƠN</h1>
      <p className='font-semibold'>
        <span>Mã hóa đơn</span>: <span>16059</span>
      </p>

      <hr className='my-5' />

      {/* Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Ngày mua: </span>
          <span className=''>14/03/2024 08:46:22</span>
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Trạng thái: </span>
          <span className='font-semibold text-green-600'>Đã xử lí</span>
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Người nhận: </span>
          <span className='text-sky-600'>diwas118151@gmail.com</span>
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Tổng tiền: </span>
          <span className=''>699.000 ₫</span>
        </div>
      </div>

      <div className='pt-6' />

      {/* Product */}
      <h3 className='text-2xl font-semibold mb-4'>SẢN PHẨM</h3>

      {Array.from({ length: 3 }).map((_, index) => (
        <div className='pl-5 relative mb-5' key={index}>
          <div className='absolute top-1/2 -translate-y-1/2 left-0 h-[88%] w-px bg-slate-200' />

          <div className='rounded-medium border border-slate-300 shadow-lg p-21'>
            {/* <CartItem isCheckout localCartItem isOrderDetailProduct /> */}

            <hr className='mt-8 mb-3' />

            <div className='border border-slate-300 rounded-xl p-4'>
              <p>✅Email: anphashop749@gmail.com</p>
              <p>✅Password: Anpha74a9@</p>
              <p>✅Slot: Luffy</p>
              <p>✅Pin: 1221</p>
              <p>
                - 😊 Quà tặng ngẫu nhiên: bạn được tặng 3 kí tự ngẫu nhiên của 1 voucher, dành riêng cho
                khách hàng của gói netflix 1 tuần (Hãy tiếp tục mua hàng để khai phá voucher bạn nhá 🫡)
              </p>
              <p>- 🌠 Voucher là: KS__M__</p>
              <p>
                - ⚠️ Lưu ý: Tên profile sẽ do người bán đặt để tiện quản lí, nếu bạn đổi tên profile, tài
                khoản của bạn sẽ bị thu hồi ❌
              </p>
              <p>
                - 💀 Lưu ý: Đề phòng trường hợp những shop &quot;lừa đảo&quot; khác giả vờ mua hàng sau
                đó bán lại. Tài khoản của bạn sẽ được đổi pass từ 6 - 15 ngày 1 lần, và pass mới sẽ được
                gửi qua mail cho bạn. Hãy kiểm tra mail khi không thể đăng nhập. Xin chân thành cảm ơn🫡
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderDetailPage
