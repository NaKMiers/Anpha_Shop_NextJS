'use client'

import { FullyOrder, FullyVoucher } from '@/app/api/user/order-history/route'
import Divider from '@/components/Divider'
import AccountRankTab from '@/components/admin/tabs/AccountRankTab'
import CategoryRankTab from '@/components/admin/tabs/CategoryRankTab'
import RecentlySaleTab from '@/components/admin/tabs/RecentlySaleTab'
import TagRankTab from '@/components/admin/tabs/TagRankTab'
import UserSpendingRankTab from '@/components/admin/tabs/UserSpendingRank'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { IUser } from '@/models/UserModel'
import { formatPrice } from '@/utils/number'
import { useEffect, useMemo, useState } from 'react'
import { FaDollarSign } from 'react-icons/fa'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AccountWithProduct } from './account/all/page'
import { getFullDataApi } from '@/requests'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'

const chartData = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'February',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'March',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'April',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'June',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'July',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'August',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'September',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'October',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'November',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: 'December',
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

function AdminPage() {
  // hooks
  const dispatch = useAppDispatch()

  // data
  const [revenueStat, setRevenueStat] = useState<any>(null)
  const [newOrderStat, setNewOrderStat] = useState<any>(null)
  const [newAccountSoldStat, setNewAccountSoldStat] = useState<any>(null)
  const [newUserStat, setNewUserStat] = useState<any>(null)
  const [newUsedVoucherStat, setNewUsedVoucherStat] = useState<any>(null)

  const [orders, setOrders] = useState<FullyOrder[]>([])
  const [accounts, setAccounts] = useState<AccountWithProduct[]>([])
  const [spentUsers, setSpentUsers] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [vouchers, setVouchers] = useState<FullyVoucher[]>([])

  // states
  const [by, setBy] = useState<'day' | 'month' | 'year'>('month')
  const [selectedChart, setSelectedChart] = useState<
    'revenue' | 'order' | 'account' | 'new-user' | 'voucher'
  >('revenue')
  const [tab, setTab] = useState<number>(2)

  // tabs
  const tabs = useMemo(
    () => [
      <RecentlySaleTab className='h-[500px] overflow-y-scroll ' key={1} />,
      <AccountRankTab accounts={accounts} className='h-[500px] overflow-y-scroll' key={2} />,
      <UserSpendingRankTab users={spentUsers} className='h-[500px] overflow-y-scroll' key={5} />,
      <CategoryRankTab categories={categories} className='h-[500px] overflow-y-scroll' key={3} />,
      <TagRankTab tags={tags} className='h-[500px] overflow-y-scroll' key={4} />,
    ],
    [categories, tags, accounts, spentUsers]
  )

  // get full data
  useEffect(() => {
    const getFullData = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const res = await getFullDataApi()
        const {
          revenueStat,
          newOrderStat,
          newAccountSoldStat,
          newUserStat,
          newUsedVoucherStat,

          categories,
          tags,
          spentUsers,
        } = res

        console.log('res', res)
        // stats
        setRevenueStat(revenueStat)
        setNewOrderStat(newOrderStat)
        setNewAccountSoldStat(newAccountSoldStat)
        setNewUserStat(newUserStat)
        setNewUsedVoucherStat(newUsedVoucherStat)

        // data
        setOrders(orders)
        setAccounts(accounts)
        setSpentUsers(spentUsers)
        setCategories(categories)
        setTags(tags)
        setVouchers(vouchers)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getFullData()
  }, [dispatch, accounts, orders, vouchers])

  return (
    <div className='bg-white text-dark rounded-medium shadow-medium p-21'>
      {/* Staticticals */}
      <h1 className='text-2xl font-semibold'>Dashboard</h1>

      {/* Filter By Time */}
      <div className='flex justify-end'>
        <select
          className='appearance-none p-2.5 font-semibold text-sm bg-dark-100 text-white focus:outline-none focus:ring-0 peer rounded-lg cursor-pointer'
          onChange={e => setBy(e.target.value as never)}
          defaultValue={'month'}>
          <option
            className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
            value='day'>
            By Day
          </option>
          <option
            className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
            value='month'>
            By Month
          </option>
          <option
            className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
            value='year'>
            By Year
          </option>
        </select>
      </div>

      <Divider size={4} />

      <div className='grid grid-cols-12 gap-x-21 gap-y-16'>
        {/* Stats */}
        <div className='col-span-12 grid grid-cols-5 gap-x-21 gap-y-21/2'>
          {/* Revenue Stat */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>Revenue</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3' title={formatPrice(revenueStat?.[by][0] || 0)}>
              {formatPrice(revenueStat?.[by][0] || 0)}
            </p>
            <p
              className='text-slate-500 text-sm'
              title={`${revenueStat?.[by][2] > 0 ? '+' : ''}${revenueStat?.[by][2]}% from last month`}>
              {revenueStat?.[by][2] > 0 ? '+' : ''}
              {revenueStat?.[by][2] || 0}% from last month
            </p>
          </div>

          {/* New Order Stat */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>New Order</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3' title={newOrderStat?.[by][0] || 0}>
              {newOrderStat?.[by][0]}
            </p>
            <p
              className='text-slate-500 text-sm'
              title={`${newOrderStat?.[by][2] > 0 ? '+' : ''}${
                newOrderStat?.[by][2] || 0
              }% from last month`}>
              {newOrderStat?.[by][2] > 0 ? '+' : ''}
              {newOrderStat?.[by][2] || 0}% from last month
            </p>
          </div>

          {/* Sale Account Stat */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>Sale Accounts</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3' title={newAccountSoldStat?.[by][0] || 0}>
              {newAccountSoldStat?.[by][0] || 0}
            </p>
            <p
              className='text-slate-500 text-sm'
              title={`${newAccountSoldStat?.[by][2] > 0 ? '+' : ''}${
                newAccountSoldStat?.[by][2] || 0
              }% from last month`}>
              {newAccountSoldStat?.[by][2] > 0 ? '+' : ''}
              {newAccountSoldStat?.[by][2] || 0}% from last month
            </p>
          </div>

          {/* New User Stat */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>New User</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3' title={newUserStat?.[by][0] || 0}>
              {newUserStat?.[by][0] || 0}
            </p>
            <p
              className='text-slate-500 text-sm'
              title={`${newUserStat?.[by][2] > 0 ? '+' : ''}${
                newUserStat?.[by][2] || 0
              }% from last month`}>
              {newUserStat?.[by][2] > 0 ? '+' : ''}
              {newUserStat?.[by][2] || 0}% from last month
            </p>
          </div>

          {/* Used Voucher Stat */}
          <div className='p-21 rounded-lg shadow-lg bg-white'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-body tracking-wider text-lg'>New Used Voucher</span>
              <FaDollarSign size={20} />
            </div>

            <p className='font-semibold text-3xl mb-3' title={newUsedVoucherStat?.[by][0] || 0}>
              {newUsedVoucherStat?.[by][0] || 0}
            </p>
            <p
              className='text-slate-500 text-sm'
              title={`${newUsedVoucherStat?.[by][2] > 0 ? '+' : ''}${
                newUsedVoucherStat?.[by][2] || 0
              }% from last month`}>
              {newUsedVoucherStat?.[by][2] > 0 ? '+' : ''}
              {newUsedVoucherStat?.[by][2] || 0}% from last month
            </p>
          </div>
        </div>

        {/* Chart & Rank */}
        <div className='col-span-12 grid grid-cols-12 gap-21'>
          {/* BarChart */}
          <div className='col-span-7'>
            <div className='flex gap-2 px-2'>
              <span
                className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition ${
                  selectedChart === 'revenue' ? 'bg-dark-100 text-white border-transparent' : ''
                }`}
                onClick={() => setSelectedChart('revenue')}>
                Revenue
              </span>
              <span
                className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition ${
                  selectedChart === 'order' ? 'bg-dark-100 text-white border-transparent' : ''
                }`}
                onClick={() => setSelectedChart('order')}>
                Order
              </span>
              <span
                className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition ${
                  selectedChart === 'account' ? 'bg-dark-100 text-white border-transparent' : ''
                }`}
                onClick={() => setSelectedChart('account')}>
                Account
              </span>
              <span
                className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition ${
                  selectedChart === 'new-user' ? 'bg-dark-100 text-white border-transparent' : ''
                }`}
                onClick={() => setSelectedChart('new-user')}>
                New User
              </span>
              <span
                className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition ${
                  selectedChart === 'voucher' ? 'bg-dark-100 text-white border-transparent' : ''
                }`}
                onClick={() => setSelectedChart('voucher')}>
                Voucher
              </span>
            </div>
            <div className='border p-21 rounded-lg shadow-lg'>
              <ResponsiveContainer height={500}>
                <BarChart data={chartData}>
                  {/* <Legend /> */}
                  <CartesianGrid strokeDasharray='3 3' />

                  <XAxis dataKey={'name'} tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis dataKey={'total'} tickLine={false} axisLine={false} fontSize={12} />
                  <Bar dataKey={'total'} fill='#111' radius={[4, 4, 4, 4]} />
                  <Tooltip
                    cursor={{ stroke: '#333', strokeWidth: 2 }}
                    animationEasing='ease-in-out'
                    animationDuration={200}
                    labelFormatter={value => `Month: ${value}`}
                    labelStyle={{ color: '#01dbe5' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rank */}
          <div className='col-span-5'>
            <div className='flex gap-2 px-2'>
              {['Recently Sales', 'Account Rank', 'User Spending Rank', 'Category Rank', 'Tag Rank'].map(
                (label, index) => (
                  <span
                    className={`px-2 py-1 text-nowrap rounded-t-lg border border-b-0 cursor-pointer common-transition max-w-[100px] text-ellipsis line-clamp-1 block ${
                      tab === index + 1 ? 'bg-dark-100 text-white border-transparent' : ''
                    }`}
                    onClick={() => setTab(index + 1)}
                    title={label}
                    key={index}>
                    {label}
                  </span>
                )
              )}
            </div>
            <div className='border p-21 rounded-lg shadow-lg'>{tabs[tab - 1]}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
