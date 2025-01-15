'use client'
import { BlocksType, OrderChartType } from '@/app/api/admin/route'
import Chart, { CharDatum } from '@/components/admin/Chart'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { getDashboardApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { toUTC } from '@/utils/time'
import { AnimatePresence, motion } from 'framer-motion'
import momentTZ from 'moment-timezone'
import { useCallback, useEffect, useState } from 'react'
import { DateRange, RangeKeyDict } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaCircleNotch } from 'react-icons/fa'

const rangeOptions = [
  {
    label: 'Today',
    range: [
      {
        startDate: momentTZ().startOf('day').toDate(),
        endDate: momentTZ().endOf('day').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Yesterday',
    range: [
      {
        startDate: momentTZ().subtract(1, 'days').startOf('day').toDate(),
        endDate: momentTZ().subtract(1, 'days').endOf('day').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Last 7 days',
    range: [
      {
        startDate: momentTZ().subtract(7, 'days').startOf('day').toDate(),
        endDate: momentTZ().subtract(1, 'days').endOf('day').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Last 30 days',
    range: [
      {
        startDate: momentTZ().subtract(30, 'days').startOf('day').toDate(),
        endDate: momentTZ().subtract(1, 'days').endOf('day').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Last 90 days',
    range: [
      {
        startDate: momentTZ().subtract(90, 'days').startOf('day').toDate(),
        endDate: momentTZ().subtract(1, 'days').endOf('day').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Last 365 days',
    range: [
      {
        startDate: momentTZ().subtract(365, 'days').startOf('day').toDate(),
        endDate: momentTZ().subtract(1, 'days').endOf('day').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'This month',
    range: [
      {
        startDate: momentTZ().startOf('month').toDate(),
        endDate: momentTZ().endOf('month').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Last month',
    range: [
      {
        startDate: momentTZ().subtract(1, 'month').startOf('month').toDate(),
        endDate: momentTZ().subtract(1, 'month').endOf('month').toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Week to date',
    range: [
      {
        startDate: momentTZ().startOf('isoWeek').toDate(),
        endDate: momentTZ().toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Month to date',
    range: [
      {
        startDate: momentTZ().startOf('month').toDate(),
        endDate: momentTZ().toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'Year to date',
    range: [
      {
        startDate: momentTZ().startOf('year').toDate(),
        endDate: momentTZ().toDate(),
        key: 'selection',
      },
    ],
  },
  {
    label: 'All time',
    range: [
      {
        startDate: momentTZ('2004-09-14').toDate(),
        endDate: momentTZ().toDate(),
        key: 'selection',
      },
    ],
  },
]

function AdminPage() {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRangeOption, setSelectedRangeOption] = useState<string>('Today')
  const [range, setRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  // blocks
  const [orders, setOrders] = useState<OrderChartType[]>([])
  const [blocks, setBlocks] = useState<BlocksType | null>(null)

  // filter states
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCats, setSelectedCats] = useState<ICategory[]>([])
  const [openCat, setOpenCat] = useState<boolean>(false)

  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<ITag[]>([])
  const [openTag, setOpenTag] = useState<boolean>(false)

  const [aEmails, setAEmails] = useState<string[]>([])
  const [selectedAEmails, setSelectedAEmails] = useState<string[]>([])
  const [openAEmail, setOpenAEmail] = useState<boolean>(false)

  // chart data
  const [data, setData] = useState<CharDatum[]>([])

  // fetch dashboard
  const handleGetDashboard = useCallback(async () => {
    let query = '?'
    const from = toUTC(momentTZ(range[0].startDate).startOf('day').toDate())
    const to = toUTC(momentTZ(range[0].endDate).endOf('day').toDate())

    query += `from-to=${from}|${to}`

    // start loading
    setLoading(true)

    try {
      const { orders, blocks } = await getDashboardApi(query)

      console.log('Dashboard:', orders)

      setOrders(orders)
      setBlocks(blocks)

      const categories = orders.map((order: OrderChartType) => order.categories).flat()
      const uniqueCategories: any[] = Array.from(
        new Map(categories.map((category: ICategory) => [category._id, category])).values()
      )
      setCategories(uniqueCategories)
      setSelectedCats(uniqueCategories)

      const tags = orders.map((order: OrderChartType) => order.tags).flat()
      const uniqueTags: any[] = Array.from(new Map(tags.map((tag: ITag) => [tag._id, tag])).values())
      setTags(uniqueTags)
      setSelectedTags(uniqueTags)

      const aEmails = orders.map((order: OrderChartType) => order.accounts).flat()
      const uniqueAEmails: any[] = Array.from(
        new Map(aEmails.map((aEmail: string) => [aEmail, aEmail])).values()
      )
      setAEmails(uniqueAEmails)
      setSelectedAEmails(uniqueAEmails)
      console.log('uniqueAEmails:', uniqueAEmails)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [range])

  // initial fetch
  useEffect(() => {
    console.log('Initial Fetch')
    handleGetDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle select date range
  const handleSelect = (ranges: RangeKeyDict) => {
    setRange([ranges.selection])
  }

  // auto update chart data
  useEffect(() => {
    // start page loading
    dispatch(setPageLoading(true))

    // filter orders by categories
    let filteredOrders = orders.filter(order =>
      selectedCats.some(cat => order.categories.some(c => c._id === cat._id))
    )

    console.log('Filtered Orders:', filteredOrders)

    // filter order by tags
    filteredOrders = filteredOrders.filter(order =>
      selectedTags.some(tag => order.tags.some(t => t._id === tag._id))
    )

    console.log('Filtered Orders:', filteredOrders)

    // filter order by emails
    filteredOrders = filteredOrders.filter(order =>
      order.accounts.some(email => selectedAEmails.includes(email))
    )

    console.log('Filtered Orders:', filteredOrders)
    // split data into columns
    // x = end date - start date
    // x > 1 years -> split charts into cols of years
    // 1 year >= x > 1 months -> split charts into cols of months
    // 1 month >= x > 1 days -> split charts into cols of days
    // 1 day >= x > 1 hours -> split charts into cols of hours

    const start = toUTC(momentTZ(range[0].startDate).startOf('day').toDate())
    const end = toUTC(momentTZ(range[0].endDate).endOf('day').toDate())

    const duration = momentTZ(end).diff(momentTZ(start), 'seconds') // Get duration in seconds
    const oneDayInSeconds = 24 * 60 * 60

    let splitGranularity = 'years' // Default granularity
    if (duration > oneDayInSeconds * 366) {
      splitGranularity = 'years'
    } else if (duration > oneDayInSeconds * 31) {
      splitGranularity = 'months'
    } else if (duration > oneDayInSeconds) {
      splitGranularity = 'days'
    } else if (duration > 60 * 60) {
      splitGranularity = 'hours'
    }

    console.log(`Splitting data into columns by ${splitGranularity}`)

    // Initialize an empty data object
    const groupedData: CharDatum[] = []
    const iterator = momentTZ(start)

    while (iterator.isBefore(end)) {
      const colStart = iterator.clone()
      let colEnd = colStart.clone().endOf(splitGranularity as moment.unitOfTime.StartOf)

      // Adjust colEnd to include 24:00 (the start of the next day)
      if (splitGranularity === 'days') {
        colEnd = colEnd.add(1, 'days').startOf('day')
      }

      // Filter orders in this range
      const filteredOrders2 = filteredOrders.filter(order => {
        const orderDate = momentTZ(order.createdAt).utc()
        return orderDate.isBetween(colStart, colEnd, undefined, '[)')
      })

      const totalValue = filteredOrders2.reduce((sum, order) => sum + order.total, 0)

      let dateFormat = 'DD'
      switch (splitGranularity) {
        case 'years':
          dateFormat = 'YYYY'
          break
        case 'months':
          dateFormat = 'MMM'
          break
        case 'days':
          dateFormat = 'DD'
          break
        case 'hours':
          dateFormat = 'HH:00'
          break
        default:
          break
      }

      groupedData.push({
        name: colStart.format(dateFormat),
        value: totalValue,
      })

      iterator.add(1, splitGranularity as moment.unitOfTime.DurationConstructor)
    }

    setData(groupedData)

    // stop page loading
    dispatch(setPageLoading(false))
  }, [orders, selectedAEmails, selectedCats, selectedTags])

  return (
    <div className="-mx-21 -my-20 bg-white p-21 text-dark">
      {/* Statistical */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* MARK: Date Range */}
      <div className="relative">
        <button
          className="mt-5 flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md"
          onClick={() => setOpen(true)}
        >
          <FaCalendarAlt size={13} />
          <span className="text-xs font-semibold">
            {momentTZ(range[0].startDate).format('MMM D')} -{' '}
            {momentTZ(range[0].endDate).format('MMM D, YYYY')}
          </span>
        </button>

        {open && (
          <div
            className="fixed left-0 top-0 z-10 h-screen w-screen"
            onClick={() => setOpen(false)}
          />
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-0 top-[calc(100%+10.5px)] z-10 overflow-hidden rounded-lg bg-white shadow-lg"
            >
              <div className="flex">
                <div className="flex h-full max-h-[428px] flex-col gap-21/2 overflow-y-auto px-21/2 py-1">
                  {rangeOptions.map(option => (
                    <button
                      className={`trans-200 w-full rounded-lg px-21 py-1 text-left hover:bg-dark-100 hover:text-light ${option.label === selectedRangeOption ? 'bg-dark-100 text-light' : ''}`}
                      onClick={() => {
                        setRange(option.range)
                        setSelectedRangeOption(option.label)
                      }}
                      key={option.label}
                    >
                      <span className="text-xs font-semibold">{option.label}</span>
                    </button>
                  ))}
                </div>
                <DateRange
                  ranges={range}
                  onChange={handleSelect}
                  rangeColors={['#333']}
                  months={2}
                  direction="horizontal"
                  showMonthAndYearPickers={true}
                  key={JSON.stringify(range)} // Add key here to force re-render
                />
              </div>
              <div className="flex justify-end gap-21/2 p-21/2 pt-0">
                <button
                  disabled={false}
                  className={`trans-200 group flex h-7 min-w-[48px] items-center justify-center rounded-lg border border-dark px-3 py-2 text-xs font-semibold text-dark hover:bg-slate-200 ${
                    false ? 'pointer-events-none bg-slate-200' : ''
                  }`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`trans-200 group flex h-7 min-w-[48px] items-center justify-center rounded-lg bg-dark-100 px-3 py-2 text-xs font-semibold text-white hover:bg-primary hover:text-dark ${
                    false ? 'pointer-events-none bg-slate-200' : ''
                  }`}
                  disabled={false}
                  onClick={() => {
                    handleGetDashboard()
                    setOpen(false)
                  }}
                >
                  {false ? (
                    <FaCircleNotch
                      size={18}
                      className="trans-200 animate-spin text-white group-hover:text-dark"
                    />
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MARK: Blocks */}
      <div className="mt-4 grid grid-cols-2 gap-x-21 gap-y-2 md:grid-cols-5">
        <button
          className="trans-200 flex flex-col rounded-lg bg-dark-100 px-21 py-3 text-sm text-light shadow-lg"
          disabled={loading}
        >
          <span className="font-bold tracking-wider">Revenue</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{formatPrice(blocks.revenue)}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[100px] rounded-md shadow-sm shadow-light" />
          )}
        </button>
        <button
          className="trans-200 flex flex-col rounded-lg px-21 py-3 text-sm shadow-lg"
          disabled={loading}
        >
          <span className="font-bold tracking-wider">Orders</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{blocks.orders}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[60px] rounded-md shadow-sm shadow-light" />
          )}
        </button>
        <button
          className="trans-200 flex flex-col rounded-lg px-21 py-3 text-sm shadow-lg"
          disabled={loading}
        >
          <span className="font-bold tracking-wider">Accounts</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{blocks.accounts}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[60px] rounded-md shadow-sm shadow-light" />
          )}
        </button>
        <button
          className="trans-200 flex flex-col rounded-lg px-21 py-3 text-sm shadow-lg"
          disabled={loading}
        >
          <span className="font-bold tracking-wider">Customers</span>
          {blocks && !loading ? (
            <p className="mt-1 font-semibold">
              {blocks.customers} (
              <span
                className="text-primary"
                title="Users"
              >
                {blocks.users}
              </span>{' '}
              +{' '}
              <span
                className="text-slate-400"
                title="Non-Users"
              >
                {blocks.nonUsers}
              </span>{' '}
              -{' '}
              <span
                className="text-rose-500"
                title="Potential Users"
              >
                {blocks.potentialUsers}
              </span>
              )
            </p>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[100px] rounded-md shadow-sm shadow-light" />
          )}
        </button>
        <button
          className="trans-200 flex flex-col rounded-lg px-21 py-3 text-sm shadow-lg"
          disabled={loading}
        >
          <span className="font-bold tracking-wider">Vouchers</span>

          {blocks && !loading ? (
            <p className="mt-1 font-semibold">
              <span>{blocks.vouchers}</span> - <span>{formatPrice(blocks.voucherDiscount)}</span>
            </p>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[115px] rounded-md shadow-sm shadow-light" />
          )}
        </button>
      </div>

      {/* Filter */}
      <div className="mt-5 flex gap-2">
        {(openCat || openTag || openAEmail) && (
          <div
            className="fixed left-0 top-0 z-10 h-screen w-screen"
            onClick={() => {
              setOpenCat(false)
              setOpenTag(false)
              setOpenAEmail(false)
            }}
          />
        )}

        <div className="relative">
          <button
            className="trans-200 rounded-md px-2 py-1.5 text-xs font-semibold shadow-md hover:bg-slate-100"
            onClick={() => categories.length > 0 && setOpenCat(!openCat)}
          >
            {selectedCats.length} {selectedCats.length !== 0 ? 'categories' : 'category'}
          </button>

          <AnimatePresence>
            {openCat && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex flex-col gap-0.5 rounded-md bg-white shadow-md"
              >
                <button
                  className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                    selectedCats.length === categories.length ? 'border-l-2 border-primary pl-2' : ''
                  }`}
                  onClick={() =>
                    selectedCats.length === categories.length
                      ? setSelectedCats([])
                      : setSelectedCats(categories)
                  }
                >
                  <span className="text-nowrap">All</span>
                </button>
                {categories.map((cat, index) => (
                  <button
                    className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                      selectedCats.some(c => c._id.toString() === cat._id.toString())
                        ? 'border-l-2 border-primary pl-2'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedCats(prev =>
                        prev.some(c => c._id.toString() === cat._id.toString())
                          ? prev.filter(c => c._id.toString() !== cat._id.toString())
                          : [...prev, cat]
                      )
                    }
                    key={index}
                  >
                    <span
                      className="text-nowrap"
                      style={{ color: cat.color || '#333' }}
                    >
                      {cat.title}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            className="trans-200 rounded-md px-2 py-1.5 text-xs font-semibold shadow-md hover:bg-slate-100"
            onClick={() => tags.length > 0 && setOpenTag(!openTag)}
          >
            {selectedTags.length} {selectedTags.length !== 0 ? 'tags' : 'tag'}
          </button>

          <AnimatePresence>
            {openTag && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex flex-col gap-0.5 rounded-md bg-white shadow-md"
              >
                <button
                  className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                    selectedTags.length === tags.length ? 'border-l-2 border-primary pl-2' : ''
                  }`}
                  onClick={() =>
                    selectedTags.length === tags.length ? setSelectedTags([]) : setSelectedTags(tags)
                  }
                >
                  <span className="text-nowrap">All</span>
                </button>
                {tags.map((tag, index) => (
                  <button
                    className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                      selectedTags.some(t => t._id.toString() === tag._id.toString())
                        ? 'border-l-2 border-primary pl-2'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedTags(prev =>
                        prev.some(t => t._id.toString() === tag._id.toString())
                          ? prev.filter(t => t._id.toString() !== tag._id.toString())
                          : [...prev, tag]
                      )
                    }
                    key={index}
                  >
                    <span className="text-nowrap">{tag.title}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            className="trans-200 rounded-md px-2 py-1.5 text-xs font-semibold shadow-md hover:bg-slate-100"
            onClick={() => aEmails.length > 0 && setOpenAEmail(!openAEmail)}
          >
            {selectedAEmails.length} {selectedAEmails.length !== 0 ? 'emails' : 'email'}
          </button>

          <AnimatePresence>
            {openAEmail && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex flex-col gap-0.5 rounded-md bg-white shadow-md"
              >
                <button
                  className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                    selectedAEmails.length === aEmails.length ? 'border-l-2 border-primary pl-2' : ''
                  }`}
                  onClick={() =>
                    selectedAEmails.length === aEmails.length
                      ? setSelectedAEmails([])
                      : setSelectedAEmails(aEmails)
                  }
                >
                  <span className="text-nowrap">All</span>
                </button>
                {aEmails.map((email, index) => (
                  <button
                    className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                      selectedAEmails.includes(email) ? 'border-l-2 border-primary pl-2' : ''
                    }`}
                    onClick={() =>
                      setSelectedAEmails(prev =>
                        prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
                      )
                    }
                    key={index}
                  >
                    <span className="text-nowrap">{email}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chart & Tabs */}
      <Chart
        data={data}
        className="mt-2 rounded-lg p-21/2 shadow-lg"
      />

      {/* Ranks */}
      {/* <div className="mt-5 grid grid-cols-1 gap-21 lg:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg p-21 shadow-lg">
          <h2 className="font-semibold">Sales</h2>

          <RecentlySaleTab className="mt-4 max-h-[500px] overflow-y-auto" />
        </div>

        <div className="rounded-lg p-21 shadow-lg">
          <h2 className="font-semibold">Account Rank</h2>

          <AccountRankTab className="mt-4 max-h-[500px] overflow-y-auto" />
        </div>

        <div className="rounded-lg p-21 shadow-lg">
          <h2 className="font-semibold">Spending Rank</h2>

          <UserSpendingRank className="mt-4 max-h-[500px] overflow-y-auto" />
        </div>

        <div className="rounded-lg p-21 shadow-lg">
          <h2 className="font-semibold">Category Rank</h2>

          <CategoryRankTab className="mt-4 max-h-[500px] overflow-y-auto" />
        </div>

        <div className="rounded-lg p-21 shadow-lg">
          <h2 className="font-semibold">Tag Rank</h2>

          <TagRankTab className="mt-4 max-h-[500px] overflow-y-auto" />
        </div>
      </div> */}
    </div>
  )
}

export default AdminPage
