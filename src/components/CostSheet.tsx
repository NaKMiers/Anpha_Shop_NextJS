import { ICostGroup } from '@/models/CostGroupModel'
import { ICost } from '@/models/CostModel'
import { getAllCostGroupsApi, getAllCostsApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useEffect, useMemo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaFilter } from 'react-icons/fa'
import CostGroupArea from './CostGroupArea'
import CostList from './CostList'

interface CostSheetProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  className?: string
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

function CostSheet({ open, setOpen, className = '' }: CostSheetProps) {
  // cost groups
  const [costGroups, setCostGroups] = useState<ICostGroup[]>([])

  // states
  const [costs, setCosts] = useState<ICost[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedCosts, setSelectedCosts] = useState<string[]>([])

  // loading and confirming
  const [loading, setLoading] = useState<string[]>([])
  const [loadingCosts, setLoadingCosts] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const limit = 10

  // Form
  const defaultValues: FieldValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'createdAt|-1',
      status: '',
      from: '',
      to: '',
    }),
    []
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // get all cost groups
  useEffect(() => {
    const getCostGroups = async () => {
      try {
        const { costGroups } = await getAllCostGroupsApi()
        setCostGroups(costGroups)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    getCostGroups()
  }, [])

  // get all costs
  useEffect(() => {
    // start loading
    // setLoading(true)

    const getCosts = async () => {
      try {
        // send request to server
        const { costs } = await getAllCostsApi()

        // set costs
        setCosts(costs)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        // setLoading(false)
      }
    }

    getCosts()
  }, [])

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed left-0 top-0 h-full w-full"
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
            className={`fixed right-0 top-0 h-full w-full max-w-[600px] rounded-l-xl border-l-2 border-dark bg-white px-21/2 py-21 shadow-lg md:px-21 ${className}`}
          >
            {/* Filters */}
            <div className="flex flex-col gap-21/2">
              <div className="flex items-center justify-between gap-21/2">
                <input
                  id="search"
                  type="text"
                  className="h-8 flex-1 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                  disabled={false}
                  placeholder="Search..."
                  {...register('search', { required: true })}
                />
                <select
                  id="sort"
                  className="h-8 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                  style={{ WebkitAppearance: 'none' }}
                  disabled={false}
                  {...register('sort', { required: true })}
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
                <input
                  id="from"
                  type="datetime-local"
                  className="h-8 flex-1 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                  disabled={false}
                  placeholder="Search..."
                  {...register('from', { required: true })}
                />
                <input
                  id="from"
                  type="datetime-local"
                  className="h-8 flex-1 rounded-md border-b-2 border-dark px-3 text-xs text-dark shadow-md outline-none"
                  disabled={false}
                  placeholder="Search..."
                  {...register('from', { required: true })}
                />
              </div>

              <div className="flex items-center justify-between gap-21/2">
                <CostGroupArea
                  costGroups={costGroups}
                  setCostGroups={setCostGroups}
                />

                <div className="flex gap-21/2">
                  <button className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light">
                    <span className="text-xs font-semibold">Filter</span>
                    <FaFilter
                      size={12}
                      className="wiggle"
                    />
                  </button>
                  <button className="trans-200 group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md hover:bg-dark-100 hover:text-light">
                    <span className="text-xs font-semibold">Reset</span>
                    <BiReset
                      size={14}
                      className="wiggle"
                    />
                  </button>
                </div>
              </div>

              <CostList
                costs={costs}
                setCosts={setCosts}
                costGroups={costGroups}
                className="mt-5"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(CostSheet)
