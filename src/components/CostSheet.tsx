import { getRangeOptions } from '@/constants'
import { ICostGroup } from '@/models/CostGroupModel'
import { ICost } from '@/models/CostModel'
import { getAllCostsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { toUTC } from '@/utils/time'
import { AnimatePresence, motion } from 'framer-motion'
import momentTZ from 'moment-timezone'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import CostGroupArea from './CostGroupArea'
import CostList from './CostList'
import Divider from './Divider'

interface CostSheetProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
  searchParams?: { [key: string]: string | string[] }
}

const sortOptions = [
  {
    value: 'createdAt|-1',
    label: 'Newest',
    selected: true,
  },
  {
    value: 'createdAt|1',
    label: 'Oldest',
  },
  {
    value: 'updatedAt|-1',
    label: 'Latest',
  },
  {
    value: 'updatedAt|1',
    label: 'Earliest',
  },
  {
    value: 'date|-1',
    label: 'Paid First',
  },
  {
    value: 'date|1',
    label: 'Paid Last',
  },
]

const rangeOptions = getRangeOptions()

function CostSheet({ open, setOpen, searchParams, className = '' }: CostSheetProps) {
  // cost groups
  const [costGroups, setCostGroups] = useState<ICostGroup[]>([])

  // states
  const [costs, setCosts] = useState<ICost[]>([])
  const [amount, setAmount] = useState<number>(0)

  // loading and confirming
  const [loading, setLoading] = useState<boolean>(false)

  const [limit, setLimit] = useState<number>(100)
  const [pageOptions, setPageOptions] = useState<{ value: number; label: string; selected: boolean }[]>(
    []
  )

  console.log('amount:', amount)
  console.log('limit:', limit)

  useEffect(() => {
    setPageOptions(
      Array.from({ length: Math.ceil(amount / limit) }).map((_, index) => ({
        value: index + 1,
        label: `Page ${index + 1}`,
        selected: index === 0,
      }))
    )
  }, [limit, amount])

  // Form
  const defaultValues: FieldValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'createdAt|-1',
      status: '',
      from: '',
      to: '',
      limit: 100,
      page: 1,
    }),
    []
  )
  const { register, handleSubmit, setValue, reset } = useForm<FieldValues>({
    defaultValues,
  })

  // update from to when searchParams changes
  const fromRef = useRef<string>('')
  const toRef = useRef<string>('')
  useEffect(() => {
    if (searchParams) {
      let fromTo = searchParams?.['from-to']
      let from = ''
      let to = ''
      if (fromTo) {
        const [start, end] = (fromTo as string).split('|')
        from = momentTZ(start).startOf('day').format('YYYY-MM-DDTHH:mm')
        to = momentTZ(end).endOf('day').format('YYYY-MM-DDTHH:mm')
      } else {
        from = momentTZ(new Date()).startOf('day').format('YYYY-MM-DDTHH:mm')
        to = momentTZ(new Date()).endOf('day').format('YYYY-MM-DDTHH:mm')
      }
      setValue('from', from)
      setValue('to', to)
      fromRef.current = from
      toRef.current = to
    }
  }, [searchParams, setValue])

  // get all costs
  const getCosts = useCallback(async (query: string) => {
    // start loading
    setLoading(true)

    try {
      // send request to server
      const { costs, amount } = await getAllCostsApi(query)

      // set costs
      setCosts(costs)
      setAmount(amount)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [])

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // loop through data to prevent filter default
      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!['from', 'to'].includes(key)) {
            delete data[key]
          }
        }
      }

      // from | to
      const { from, to, ...rest } = data
      const fromTo = (from ? toUTC(from) : '') + '|' + (to ? toUTC(to) : '')
      if (fromTo !== '|') {
        rest['from-to'] = fromTo
      }

      return { ...rest }
    },
    [defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...params,
      })

      getCosts(query)
    },
    [handleOptimizeFilter, getCosts]
  )

  // submit when open
  useEffect(() => {
    if (open) {
      console.log('open:', open)
      handleSubmit(handleFilter)()
    }
  }, [open, handleSubmit, handleFilter])

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset({
      ...defaultValues,
      from: fromRef.current,
      to: toRef.current,
    })
    setLimit(100)
    handleSubmit(handleFilter)()
  }, [reset, handleFilter, handleSubmit, defaultValues])

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed left-0 top-0 z-10 h-full w-full"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={() => setOpen(false)}
            className={`fixed right-0 top-0 z-30 flex h-full w-full justify-end pl-10 ${className}`}
          >
            <div
              className="relative w-full max-w-[700px] overflow-y-auto rounded-l-xl border-l-2 border-dark bg-white px-21/2 py-21 shadow-lg md:px-21"
              onClick={e => e.stopPropagation()}
            >
              {/* Filters */}
              <div className="flex flex-col gap-21/2">
                <div className="flex items-center justify-between gap-21/2">
                  <input
                    id="search"
                    type="text"
                    className="h-8 flex-1 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    disabled={loading}
                    placeholder="Search..."
                    {...register('search')}
                  />
                  <select
                    id="sort"
                    className="h-8 flex-shrink-0 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    style={{ WebkitAppearance: 'none' }}
                    disabled={loading}
                    {...register('sort')}
                    defaultValue={sortOptions.find(option => option.selected)?.value}
                  >
                    {sortOptions.map((option, index) => (
                      <option
                        className="appearance-none bg-dark-100 p-5 font-body font-semibold tracking-wider text-white"
                        key={index}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-21/2">
                  <select
                    className="h-8 flex-shrink-0 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    style={{ WebkitAppearance: 'none' }}
                    disabled={loading}
                    defaultValue="Today"
                    onChange={e => {
                      const option = rangeOptions.find(option => option.label === e.target.value)
                      if (!option) return

                      const { startDate: from, endDate: to } = option.range[0]
                      setValue('from', momentTZ(from).startOf('day').format('YYYY-MM-DDTHH:mm'))
                      setValue('to', momentTZ(to).endOf('day').format('YYYY-MM-DDTHH:mm'))
                    }}
                  >
                    {rangeOptions.map((option, index) => (
                      <option
                        className="appearance-none bg-dark-100 p-5 font-body font-semibold tracking-wider text-white"
                        key={index}
                        value={option.label}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="from"
                    type="datetime-local"
                    className="h-8 flex-1 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    disabled={loading}
                    {...register('from')}
                  />
                  <input
                    id="to"
                    type="datetime-local"
                    className="h-8 flex-1 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    disabled={loading}
                    {...register('to')}
                  />
                  <input
                    id="limit"
                    type="number"
                    className="h-8 max-w-[70px] rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    disabled={loading}
                    {...register('limit')}
                    onChange={e => {
                      const limit = +e.target.value
                      setValue('page', 1)
                      setLimit(limit)
                      setValue('limit', limit)
                    }}
                  />
                  <select
                    id="page"
                    className="h-8 flex-shrink-0 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                    style={{ WebkitAppearance: 'none' }}
                    disabled={loading}
                    {...register('page')}
                    defaultValue={pageOptions.find(option => option.selected)?.value}
                  >
                    {pageOptions.map((option, index) => (
                      <option
                        className="appearance-none bg-dark-100 p-5 font-body font-semibold tracking-wider text-white"
                        key={index}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between gap-21/2">
                  {/* Cost Group Area  */}
                  <CostGroupArea
                    costGroups={costGroups}
                    setCostGroups={setCostGroups}
                  />

                  <div className="flex gap-21/2">
                    <button
                      className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light"
                      disabled={loading}
                      onClick={handleSubmit(handleFilter)}
                    >
                      <span className="text-xs font-semibold">Filter</span>
                      <FaFilter
                        size={12}
                        className="wiggle"
                      />
                    </button>
                    <button
                      className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light"
                      disabled={loading}
                      onClick={handleResetFilter}
                    >
                      <span className="text-xs font-semibold">Reset</span>
                      <BiReset
                        size={14}
                        className="wiggle"
                      />
                    </button>
                  </div>
                </div>

                <Divider size={5} />

                {!loading ? (
                  <CostList
                    costs={costs}
                    setCosts={setCosts}
                    costGroups={costGroups}
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <RiDonutChartFill
                      size={50}
                      className="animate-spin text-slate-400"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(CostSheet)
