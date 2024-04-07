'use client'

import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { IoIosSend } from 'react-icons/io'

function AllSummariesPage() {
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
      <AdminHeader title='All Summaries' />
      {/* <Pagination /> */}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-21 '>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className='flex flex-col p-4 rounded-lg shadow-lg bg-white' key={index}>
            <div className='font-semibold' title='netflix'>
              <span title='Collaborator' className='font-semibold text-secodary mr-2'>
                Hồ Thị Ngọc Trâm
              </span>
              <span title='Commission'>10%</span>
            </div>

            <p>hothingoctram03@gmail.com</p>

            <p>
              <span className='font-semibold'>Vouchers: </span>
              <span className='text-green-500'>GUDJOB</span>{' '}
              <span className='text-green-500'>GIAM10K</span>
            </p>

            <div className='flex self-end border border-dark text-dark rounded-lg px-3 py-2 gap-4'>
              <button className='block group'>
                <IoIosSend size={18} className='group-hover:scale-125 common-transition' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllSummariesPage
