'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import { Menu, MenuItem } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import {
  FaArrowLeft,
  FaCalendar,
  FaCaretDown,
  FaCheck,
  FaCheckSquare,
  FaEye,
  FaFilter,
  FaPlus,
  FaSearch,
  FaTrash,
} from 'react-icons/fa'
import { FaBoltLightning, FaX } from 'react-icons/fa6'
import { IoMdCode } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'

function AllAccountsPage() {
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [price, setPrice] = useState(9000)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      orderCode: '',
    },
  })

  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null)
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const [anchorEl3, setAnchorEl3] = useState<null | HTMLElement>(null)
  const [anchorEl4, setAnchorEl4] = useState<null | HTMLElement>(null)
  const open1 = Boolean(anchorEl1)
  const open2 = Boolean(anchorEl2)
  const open3 = Boolean(anchorEl3)
  const open4 = Boolean(anchorEl4)

  // open menu
  const handleOpenMenu1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget)
  }
  // close menu
  const handleCloseMenu1 = () => {
    setAnchorEl1(null)
  }

  // open menu
  const handleOpenMenu2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu2 = () => {
    setAnchorEl2(null)
  }

  // open menu
  const handleOpenMenu3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu3 = () => {
    setAnchorEl2(null)
  }

  // open menu
  const handleOpenMenu4 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu4 = () => {
    setAnchorEl2(null)
  }

  const handleFilter = useCallback(() => {}, [])

  return (
    <div className='w-full'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          All Accounts
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/account/add'>
          <FaPlus />
          Add
        </Link>
      </div>

      <Pagination />

      <div className='pt-8' />

      <div className='bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex flex-col'>
            <Input
              className='max-w-[450px]'
              id='search'
              label='Search'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='text'
              icon={FaSearch}
            />
          </div>

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3'>{/* Select */}</div>
          <div className='flex justify-end md:justify-start items-center'>
            {/* Filter Button */}
            <button
              className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-light hover:text-dark common-transition'
              onClick={handleFilter}>
              Lọc
              <FaFilter size={12} className='ml-1 text-light group-hover:text-dark common-transition' />
            </button>
          </div>

          <div className='flex justify-end items-center col-span-2 gap-2'>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Delete
            </button>
            <button className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'>
              Activate
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      {/* MAIN LIST */}
      <div className='grid grid-cols-1 gap-21 lg:grid-cols-2'>
        <div
          className={`relative w-full flex justify items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition bg-white`}>
          <div className='w-full'>
            {/* Thumbnails */}
            <Link
              href='/netflix'
              className='float-left mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'>
              <div className='flex items-center w-full overflow-x-scroll snap-x no-scrollbar'>
                <Image
                  className='aspect-video flex-shrink-0 snap-start'
                  src='/images/spotify-banner.jpg'
                  height={200}
                  width={200}
                  alt='thumbnail'
                />
              </div>
            </Link>

            <div className='absolute z-10 -top-2 left-1/2 -translate-x-1/2 shadow-md text-sm text-dark bg-primary px-2 py-[2px] select-none rounded-lg font-body'>
              nhatanhdiep@yahoo.com
            </div>

            {/* Type */}
            <p
              className='inline font-semibold text-[18px] mr-2 leading-4 font-body tracking-wide'
              title='Type---'>
              Grammarly Premium (1 Tháng) - Đánh Bại Lỗi Ngữ Pháp Với Ưu Đãi Đặc Biệt
            </p>

            {/* Begin */}
            <p className='text-sm' title='Begin (d/m/y)'>
              <span className='font-semibold'>Begin: </span>
              <span>{formatTime(new Date().toString())}</span>
            </p>

            {/* Expire */}
            <p className='text-sm' title='Expire (d/m/y)'>
              <span className='font-semibold'>Expire: </span>
              <span>{formatTime(new Date().toString())}</span>
            </p>

            {/* Renew */}
            <p className='text-sm' title='Expire (d/m/y)'>
              <span className='font-semibold'>Renew: </span>
              <span>{formatTime(new Date().toString())}</span>
            </p>

            {/* Info */}
            <p className='w-full mt-2 max-h-[200px] font-body tracking-wide overflow-auto'>
              ✅Email: anphashop79@gmail.com ✅Password: 79anphas ✅Slot: A1 ✅Pin: 1179 - 😊 Quà tặng
              ngẫu nhiên: bạn được tặng 3 kí tự ngẫu nhiên của 1 voucher, dành riêng cho khách hàng của
              gói netflix 1 tuần (Hãy tiếp tục mua hàng để khai phá voucher bạn nhá 🫡) - 🌠 Voucher là:
              KSV____ - ⚠️ Lưu ý: Tên profile sẽ do người bán đặt để tiện quản lí, nếu bạn đổi tên
              profile, tài khoản của bạn sẽ bị thu hồi ❌ - 💀 Lưu ý: Đề phòng trường hợp những shop lừa
              đảo khác giả vờ mua hàng sau đó bán lại. Tài khoản của bạn sẽ được đổi pass từ 6 - 15 ngày
              1 lần, và pass mới sẽ được gửi qua mail cho bạn. Hãy kiểm tra mail khi không thể đăng nhập.
              Xin chân thành cảm ơn🫡
            </p>
          </div>

          <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
            {/* Edit Button Link */}
            <Link
              href={`/admin/product/:id/edit`}
              target='_blank'
              className='block group'
              onClick={e => e.stopPropagation()}>
              <MdEdit size={18} className='group-hover:scale-125 common-transition' />
            </Link>

            {/* Delete Button */}
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
              }}>
              <FaTrash size={18} className='group-hover:scale-125 common-transition' />
            </button>

            {/* Active Button */}
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
              }}>
              <FaCheck size={18} className='group-hover:scale-125 common-transition text-green-500' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllAccountsPage
