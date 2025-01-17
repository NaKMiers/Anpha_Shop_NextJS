import { ICostGroup } from '@/models/CostGroupModel'
import { ICost } from '@/models/CostModel'
import { addCostApi, updateCostApi } from '@/requests'
import { toUTC } from '@/utils/time'
import moment from 'moment'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { MdCancel, MdSave } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

const statusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    selected: true,
  },
  {
    value: 'approved',
    label: 'Approved',
  },
  {
    value: 'rejected',
    label: 'Rejected',
  },
]

interface CostItemProps {
  cost?: ICost
  setCosts: Dispatch<SetStateAction<ICost[]>>
  costGroups: ICostGroup[]
  setIsAddingCost?: Dispatch<SetStateAction<boolean>>
  className?: string
}

function CostItem({ cost, setCosts, costGroups, setIsAddingCost, className = '' }: CostItemProps) {
  // hooks

  // states
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [adding, setAdding] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  console.log('cost', cost)

  // values
  const costGroupOptions = costGroups.map(costGroup => ({
    value: costGroup._id,
    label: costGroup.title,
  }))

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      costGroup: cost?.costGroup
        ? typeof cost.costGroup === 'string'
          ? cost.costGroup
          : cost.costGroup._id
        : '',
      amount: cost?.amount || 0,
      desc: cost?.desc || '',
      status: cost?.status || 'pending',
      date: cost?.date ? moment(cost.date).local().format('YYYY-MM-DDTHH:mm') : '',
    }),
    [cost]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  const form = watch()
  console.log('form', form)
  useEffect(() => {
    if (cost) {
      let isChanged = false
      if (typeof cost.costGroup === 'string') {
        if (form.costGroup !== cost.costGroup) isChanged = true
      } else {
        if (form.costGroup !== cost.costGroup._id) isChanged = true
      }
      if (+form.amount !== +cost.amount) isChanged = true
      if (form.desc !== cost.desc) isChanged = true
      if (form.status !== cost.status) isChanged = true
      if (!form.date) {
        if (!!form.date !== !!cost.date) isChanged = true
      } else {
        if (form.date !== moment(cost.date).local().format('YYYY-MM-DDTHH:mm')) isChanged = true
      }
      setIsChanged(isChanged)
    }
  }, [form])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(data => {
    let isValid = true

    console.log('data', data)

    return isValid
  }, [])

  // MARK: Add Cost
  const addCost: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // cost exists -> not adding
      if (cost || !setIsAddingCost) return

      // validate form
      if (!handleValidate(data)) return

      // start adding
      setAdding(true)

      try {
        // send request to server
        const { cost } = await addCostApi({
          ...data,
          date: data.date ? toUTC(data.date) : null,
        })

        // update costs
        setCosts(prevCosts => [cost, ...prevCosts])

        // reset form
        clearErrors()
        reset({ ...defaultValues })

        setIsAddingCost(false)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop adding
        setAdding(false)
      }
    },
    [setCosts, handleValidate]
  )

  // MARK: Edit Cost
  const editCost: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // cost not exists -> not editing
      if (!cost) return

      // validate form
      if (!handleValidate(data)) return

      // start saving
      setSaving(true)

      try {
        // send request to server
        const { updatedCost } = await updateCostApi(cost._id, {
          ...data,
          date: data.date ? toUTC(data.date) : null,
        })

        // update costs
        setCosts(prevCosts =>
          prevCosts.map(prevCost => (prevCost._id === updatedCost._id ? updatedCost : prevCost))
        )

        // reset form
        clearErrors()
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop saving
        setSaving(false)
      }
    },
    [setCosts, handleValidate]
  )

  // MARK: Delete Costs
  const handleEditCosts = useCallback(async (ids: string[]) => {
    // start deleting
    setDeleting(true)

    try {
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop deleting
      setDeleting(false)
    }
  }, [])

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex h-8">
        <button
          className="trans-200 group flex h-full w-8 items-center justify-center border-b border-dark bg-slate-100 hover:bg-slate-200"
          disabled={saving || adding || deleting}
        >
          {deleting ? (
            <RiDonutChartFill
              size={14}
              className="animate-spin text-slate-500"
            />
          ) : (
            <FaTrash
              size={12}
              className="wiggle"
            />
          )}
        </button>
        {isChanged && (
          <>
            <button
              className="trans-200 group flex h-full w-8 items-center justify-center border-b border-dark bg-slate-100 hover:bg-slate-200"
              disabled={saving || adding || deleting}
              onClick={() => reset(defaultValues)}
            >
              <MdCancel
                size={14}
                className="wiggle text-slate-600"
              />
            </button>
            <button
              className="trans-200 group flex h-full w-8 items-center justify-center border-b border-dark bg-slate-100 hover:bg-slate-200"
              disabled={saving || adding || deleting}
              onClick={handleSubmit(editCost)}
            >
              {saving ? (
                <RiDonutChartFill
                  size={14}
                  className="animate-spin text-slate-500"
                />
              ) : (
                <MdSave
                  size={14}
                  className="wiggle text-green-500"
                />
              )}
            </button>
          </>
        )}
      </div>

      {!cost && setIsAddingCost && (
        <div className="flex h-8">
          <button
            className="trans-200 group flex h-full w-8 items-center justify-center border-b border-dark bg-slate-100 hover:bg-slate-200"
            disabled={saving || adding || deleting}
            onClick={() => setIsAddingCost(false)}
          >
            <MdCancel
              size={14}
              className="wiggle text-slate-600"
            />
          </button>
          <button
            className="trans-200 group flex h-full w-8 items-center justify-center border-b border-dark bg-slate-100 hover:bg-slate-200"
            disabled={saving || adding || deleting}
            onClick={handleSubmit(addCost)}
          >
            <FaPlus
              size={12}
              className="wiggle"
            />
          </button>
        </div>
      )}

      <select
        id="costGroup"
        className="h-8 border-b border-dark px-3 text-xs text-dark shadow-md outline-none"
        style={{ WebkitAppearance: 'none' }}
        disabled={false}
        {...register('costGroup', { required: true })}
      >
        <option
          value=""
          className="appearance-none bg-dark-100 p-5 font-body font-semibold tracking-wider text-white"
        >
          Select Group
        </option>
        {costGroupOptions.map((option, index) => (
          <option
            className="appearance-none bg-dark-100 p-5 font-body font-semibold tracking-wider text-white"
            key={index}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <input
        id="amount"
        type="number"
        className="h-8 flex-1 border-b border-dark px-3 text-xs text-dark shadow-md outline-none"
        disabled={false}
        min={0}
        {...register('amount', { required: true })}
      />
      <input
        id="date"
        type="datetime-local"
        className="h-8 flex-1 border-b border-dark px-3 text-xs text-dark shadow-md outline-none"
        disabled={false}
        {...register('date')}
      />
      <select
        id="status"
        className="h-8 border-b border-dark px-3 text-xs text-dark shadow-md outline-none"
        style={{ WebkitAppearance: 'none' }}
        disabled={false}
        {...register('status', { required: true })}
      >
        {statusOptions.map((option, index) => (
          <option
            className="appearance-none bg-dark-100 p-5 font-body font-semibold tracking-wider text-white"
            key={index}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <input
        id="desc"
        placeholder="Description..."
        type="text"
        className="h-8 flex-1 border-b border-dark px-3 text-xs text-dark shadow-md outline-none"
        disabled={false}
        {...register('desc')}
      />
    </div>
  )
}

export default memo(CostItem)
