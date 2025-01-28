'use client'

import { BlocksType, ChartCostType, ChartOrderType } from '@/app/api/admin/route'
import Blocks, { ActiveBlockType } from '@/components/admin/dashboard/Blocks'
import Chart, { ChartDatum } from '@/components/admin/dashboard/Chart'
import DateRangeSelection from '@/components/admin/dashboard/DateRangeSelection'
import GroupFilters from '@/components/admin/dashboard/GroupFilters'
import AccountRankTab from '@/components/admin/tabs/AccountRankTab'
import RecentlySaleTab from '@/components/admin/tabs/RecentlySaleTab'
import UserSpendingRank from '@/components/admin/tabs/UserSpendingRank'
import CostSheet from '@/components/CostSheet'
import { useAppDispatch } from '@/libs/hooks'
import { ICategory } from '@/models/CategoryModel'
import { ICostGroup } from '@/models/CostGroupModel'
import { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { getDashboardApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { toUTC } from '@/utils/time'
import { capitalize } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { default as moment, default as momentTZ } from 'moment-timezone'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { TbReload } from 'react-icons/tb'
import { VscLayoutSidebarRight } from 'react-icons/vsc'

function AdminPage({ searchParams }: { searchParams?: { [key: string]: string | string[] } }) {
  // hooks
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [range, setRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  // blocks
  const [orders, setOrders] = useState<ChartOrderType[]>([])
  const [costs, setCosts] = useState<ChartCostType[]>([])
  const [blocks, setBlocks] = useState<BlocksType | null>(null)
  const [activeBlock, setActiveBlock] = useState<ActiveBlockType>('revenue')

  // filter states
  const [products, setProducts] = useState<(IProduct & { color: string })[]>([])
  const [selectedProds, setSelectedProds] = useState<(IProduct & { color: string })[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCats, setSelectedCats] = useState<ICategory[]>([])
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<ITag[]>([])
  const [aEmails, setAEmails] = useState<string[]>([])
  const [selectedAEmails, setSelectedAEmails] = useState<string[]>([])
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [costGroups, setCostGroups] = useState<ICostGroup[]>([])
  const [selectedCostGroups, setSelectedCostGroups] = useState<ICostGroup[]>([])
  const [openCostSheet, setOpenCostSheet] = useState<boolean>(false)

  // values
  const allBlocks: ActiveBlockType[] = [
    'revenue',
    'profit',
    'costs',
    'orders',
    'accounts',
    'customers',
    'vouchers',
  ]
  const [openBlocks, setOpenBlocks] = useState<boolean>(false)
  const [selectedBlocks, setSelectedBlocks] = useState<ActiveBlockType[]>(allBlocks)

  // chart data
  const [data, setData] = useState<ChartDatum[]>([])

  // Form
  const defaultValues: FieldValues = useMemo<FieldValues>(
    () => ({
      from: new Date(),
      to: new Date(),
    }),
    []
  )
  const { handleSubmit, getValues, setValue, reset } = useForm<FieldValues>({
    defaultValues,
  })

  // get dashboard
  useEffect(() => {
    const getDashboard = async () => {
      // add from-to to search params
      if (searchParams) {
        searchParams['from-to'] =
          searchParams['from-to'] ||
          `${toUTC(momentTZ(defaultValues.from).startOf('day').toDate())}|${toUTC(momentTZ(defaultValues.from).endOf('day').toDate())}`
      }

      // sync search params with states
      const from =
        searchParams?.['from-to'] && (searchParams?.['from-to'] as string).split('|')[0]
          ? moment((searchParams['from-to'] as string).split('|')[0]).format('YYYY-MM-DDTHH:mm')
          : getValues('from')
      setValue('from', from)
      const to =
        searchParams?.['from-to'] && (searchParams?.['from-to'] as string).split('|')[1]
          ? moment((searchParams['from-to'] as string).split('|')[1]).format('YYYY-MM-DDTHH:mm')
          : getValues('to')
      setValue('to', to)

      // sync range with states
      setRange([
        {
          startDate: momentTZ(from).toDate() || new Date(),
          endDate: momentTZ(to).toDate() || new Date(),
          key: 'selection',
        },
      ])

      let query = handleQuery(searchParams)

      // start loading
      setLoading(true)

      try {
        // send request
        const { orders, costs, blocks } = await getDashboardApi(query)

        setOrders(orders)
        setCosts(costs)
        setBlocks(blocks)

        // extract products
        const products = orders.map((order: ChartOrderType) => order.products).flat()
        const uniqueProducts: any[] = Array.from(
          new Map(products.map((product: IProduct) => [product._id, product])).values()
        )
        setProducts(uniqueProducts)
        setSelectedProds(uniqueProducts)

        // extract categories
        const categories = orders.map((order: ChartOrderType) => order.categories).flat()
        const uniqueCategories: any[] = Array.from(
          new Map(categories.map((category: ICategory) => [category._id, category])).values()
        )
        setCategories(uniqueCategories)
        setSelectedCats(uniqueCategories)

        // extract tags
        const tags = orders.map((order: ChartOrderType) => order.tags).flat()
        const uniqueTags: any[] = Array.from(new Map(tags.map((tag: ITag) => [tag._id, tag])).values())
        setTags(uniqueTags)
        setSelectedTags(uniqueTags)

        // extract account emails
        const aEmails = orders.map((order: ChartOrderType) => order.accounts).flat()
        const uniqueAEmails: any[] = Array.from(
          new Map(aEmails.map((aEmail: string) => [aEmail, aEmail])).values()
        )
        setAEmails(uniqueAEmails)
        setSelectedAEmails(uniqueAEmails)

        // extract payment methods
        const paymentMethods = orders.map((order: ChartOrderType) => order.paymentMethod)
        const uniquePaymentMethods: any[] = Array.from(new Set(paymentMethods))
        setPaymentMethods(uniquePaymentMethods)
        setSelectedPaymentMethods(uniquePaymentMethods)

        // extract cost groups
        const costGroups = costs.map((cost: ChartCostType) => cost.costGroup)
        const uniqueCostGroups: any[] = Array.from(
          new Map(costGroups.map((costGroup: ICostGroup) => [costGroup._id, costGroup])).values()
        )
        setCostGroups(uniqueCostGroups)
        setSelectedCostGroups(uniqueCostGroups)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }

    getDashboard()
  }, [getValues, setValue, searchParams, defaultValues])

  // auto update chart data
  useEffect(() => {
    // start loading
    setLoading(true)

    // filter orders by products
    let filteredOrders = orders

    filteredOrders = filteredOrders.filter(
      order => selectedProds.some(prod => order.products.some(p => p._id === prod._id)) // filter by products
    )

    // filter orders by categories
    filteredOrders = filteredOrders.filter(
      order => selectedCats.some(cat => order.categories.some(c => c._id === cat._id)) // filter by categories
    )

    // filter order by tags
    filteredOrders = filteredOrders.filter(
      order => selectedTags.some(tag => order.tags.some(t => t._id === tag._id)) // filter by tags
    )

    // filter order by emails
    filteredOrders = filteredOrders.filter(
      order => order.accounts.some(email => selectedAEmails.includes(email)) // filter by account emails
    )

    // filter order by payment methods
    filteredOrders = filteredOrders.filter(order => selectedPaymentMethods.includes(order.paymentMethod)) // filter by payment methods

    // --------------------------------------
    let filterCosts = costs
    filterCosts = filterCosts.filter(
      cost => selectedCostGroups.some(costGroup => costGroup._id === cost.costGroup._id) // filter by cost groups
    )

    // split data into columns
    // x = end date - start date
    // x > 1 years -> split charts into cols of years
    // 1 year >= x > 1 months -> split charts into cols of months
    // 1 month >= x > 1 days -> split charts into cols of days
    // 1 day >= x > 1 hours -> split charts into cols of hours

    const start = toUTC(momentTZ(getValues('from')).startOf('day').toDate())
    const end = toUTC(momentTZ(getValues('to')).endOf('day').toDate())

    const duration = momentTZ(end).diff(momentTZ(start), 'seconds') // Get duration in seconds
    const oneDayInSeconds = 24 * 60 * 60

    let splitGranularity = 'years' // Default granularity
    if (duration > oneDayInSeconds * 366) {
      // > 1 year
      splitGranularity = 'years'
    } else if (duration > oneDayInSeconds * 62) {
      // > 2 months
      splitGranularity = 'months'
    } else if (duration > oneDayInSeconds) {
      // > 1 day
      splitGranularity = 'days'
    } else if (duration > 60 * 60) {
      // > 1 hour
      splitGranularity = 'hours'
    }

    // Initialize an empty data object
    const groupedData: ChartDatum[] = []
    const iterator = momentTZ(start)

    while (iterator.isBefore(end)) {
      const colStart = iterator.clone()
      let colEnd = colStart.clone().endOf(splitGranularity as moment.unitOfTime.StartOf)

      // Filter orders in this range
      const chunkOrders = filteredOrders.filter(order => {
        const orderDate = momentTZ(order.createdAt).utc()
        return orderDate.isBetween(colStart, colEnd, undefined, '[)')
      })

      // Filter costs in this range
      const chunkCosts = filterCosts.filter(cost => {
        const costDate = momentTZ(cost.date).utc()
        return costDate.isBetween(colStart, colEnd, undefined, '[)')
      })

      // Calculate total cost
      let totalCostValue = chunkCosts.reduce((sum, cost) => sum + cost.amount, 0)

      // Calculate total value
      let totalOrderValue = chunkOrders.reduce((sum, order) => sum + order.total, 0)
      switch (activeBlock) {
        case 'revenue':
          break
        case 'profit':
          totalOrderValue = totalOrderValue - totalCostValue
          break
        case 'orders':
          totalOrderValue = chunkOrders.length
          break
        case 'accounts':
          totalOrderValue = chunkOrders.reduce((total, order) => total + order.quantity, 0)
          break
        case 'vouchers':
          totalOrderValue = chunkOrders.filter(order => order.isVoucher).length
          break
        default:
          break
      }

      let dateFormat = 'DD'
      switch (splitGranularity) {
        case 'years':
          dateFormat = 'YYYY'
          break
        case 'months':
          dateFormat = 'MMM'
          break
        case 'days':
          dateFormat = 'MMM DD'
          break
        case 'hours':
          dateFormat = 'HH:00'
          break
        default:
          break
      }

      groupedData.push({
        name: colStart.format(dateFormat),
        value: activeBlock === 'costs' ? totalCostValue : totalOrderValue,
      })

      iterator.add(1, splitGranularity as moment.unitOfTime.DurationConstructor)
    }

    setData(groupedData)

    // stop page loading
    setLoading(false)
  }, [
    dispatch,
    getValues,
    orders,
    costs,
    selectedProds,
    selectedCats,
    selectedTags,
    selectedAEmails,
    selectedPaymentMethods,
    selectedCostGroups,
    activeBlock,
  ])

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // loop through data to prevent filter default

      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key]
          } else {
            data[key] = ''
          }
        }
      }

      // from | to
      const { from, to, ...rest } = data
      const fromTo =
        (from ? toUTC(momentTZ(from).startOf('day').toDate()) : '') +
        '|' +
        (to ? toUTC(momentTZ(to).endOf('day').toDate()) : '')
      if (fromTo !== '|') {
        rest['from-to'] = fromTo
      }

      return { ...rest }
    },
    [searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  console.log('openBlocks', openBlocks)

  return (
    <div className="-mx-21 -my-20 bg-white px-21/2 py-21 text-dark md:px-21">
      {/* Statistical */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="mt-5 flex flex-wrap justify-between gap-x-21 gap-y-2">
        <div className="flex flex-wrap gap-21/2 gap-y-2">
          {/* MARK: Date Range */}
          <DateRangeSelection
            range={range}
            setRange={setRange}
            setValue={setValue}
            handleFilter={handleSubmit(handleFilter)}
          />

          {/* Selected Blocks */}
          <div className="relative flex flex-wrap gap-21/2">
            <button
              className="group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md"
              onClick={() => setOpenBlocks(prev => !prev)}
            >
              <span className="text-xs font-semibold">
                {selectedBlocks.length} block{selectedBlocks.length === 1 ? '' : 's'}
              </span>
            </button>

            {/* overlay */}
            {openBlocks && (
              <div
                className="fixed left-0 top-0 z-10 h-screen w-screen"
                onClick={() => setOpenBlocks(false)}
              />
            )}

            <AnimatePresence>
              {openBlocks && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex max-h-[400px] max-w-[calc(100vw-2*21px)] flex-col gap-0.5 overflow-y-auto rounded-md bg-white shadow-md"
                >
                  <button
                    className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                      selectedBlocks.length === allBlocks.length ? 'border-l-2 border-primary pl-2' : ''
                    }`}
                    onClick={() =>
                      selectedBlocks.length === allBlocks.length
                        ? setSelectedBlocks([])
                        : setSelectedBlocks(allBlocks)
                    }
                  >
                    <span className="text-nowrap">All</span>
                  </button>
                  {allBlocks.map((block, index) => (
                    <button
                      className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                        selectedBlocks.includes(block) ? 'border-l-2 border-primary pl-2' : ''
                      }`}
                      onClick={() =>
                        setSelectedBlocks(prev =>
                          prev.includes(block) ? prev.filter(b => b !== block) : [...prev, block]
                        )
                      }
                      key={index}
                    >
                      <p className="text-nowrap">{capitalize(block)}</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset */}
          <button
            className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light"
            onClick={handleResetFilter}
          >
            <span className="text-xs font-semibold">Reset</span>
            <BiReset
              size={14}
              className="wiggle"
            />
          </button>
        </div>

        {/* Costs */}
        <div className="flex flex-wrap gap-21/2 gap-y-2">
          <button
            className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light"
            onClick={() => setOpenCostSheet(!openCostSheet)}
          >
            <span className="text-xs font-semibold">Cost Sheet</span>
            <VscLayoutSidebarRight
              size={14}
              className="wiggle"
            />
          </button>

          <button
            className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light"
            onClick={() => router.refresh()}
          >
            <span className="text-xs font-semibold">Refresh</span>
            <TbReload
              size={14}
              className="wiggle"
            />
          </button>
        </div>
      </div>

      {/* MARK: Blocks */}
      <Blocks
        blocks={blocks}
        selectedBlocks={selectedBlocks}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        loading={loading}
        className="mt-4 grid grid-cols-2 gap-x-21/2 gap-y-21/2 md:grid-cols-5 md:gap-x-21"
      />

      {/* MARK: Filters */}
      <GroupFilters
        orders={orders}
        costs={costs}
        activeBlock={activeBlock}
        className="mt-5 flex flex-wrap gap-2"
        // product
        products={products}
        selectedProds={selectedProds}
        setSelectedProds={setSelectedProds}
        // category
        categories={categories}
        selectedCats={selectedCats}
        setSelectedCats={setSelectedCats}
        // tag
        tags={tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        // account email
        aEmails={aEmails}
        selectedAEmails={selectedAEmails}
        setSelectedAEmails={setSelectedAEmails}
        // payment method
        paymentMethods={paymentMethods}
        selectedPaymentMethods={selectedPaymentMethods}
        setSelectedPaymentMethods={setSelectedPaymentMethods}
        // cost group
        costGroups={costGroups}
        selectedCostGroups={selectedCostGroups}
        setSelectedCostGroups={setSelectedCostGroups}
      />

      {/* MARK: Chart */}
      <Chart
        data={data}
        activeBlock={activeBlock}
        className="mt-2 rounded-lg p-21/2 shadow-lg"
      />

      {/* MARK: Cost Sheet */}
      <CostSheet
        open={openCostSheet}
        setOpen={setOpenCostSheet}
        searchParams={searchParams}
      />

      {/* Ranks */}
      <div className="mt-5 grid grid-cols-12 items-start gap-21/2 md:gap-21">
        <div className="col-span-12 rounded-lg p-21 shadow-lg md:col-span-5">
          <h2 className="font-semibold">Sales</h2>

          <RecentlySaleTab
            searchParams={searchParams}
            className="mt-4 max-h-[500px] overflow-y-auto"
          />
        </div>

        <div className="col-span-12 rounded-lg p-21 shadow-lg md:col-span-3">
          <h2 className="font-semibold">Account Rank</h2>

          <AccountRankTab
            orders={orders}
            loading={loading}
            className="mt-4 max-h-[500px] overflow-y-auto"
          />
        </div>

        <div className="col-span-12 rounded-lg p-21 shadow-lg md:col-span-4">
          <h2 className="font-semibold">Spending Rank</h2>

          <UserSpendingRank className="mt-4 max-h-[500px] overflow-y-auto" />
        </div>
      </div>
    </div>
  )
}

export default AdminPage
