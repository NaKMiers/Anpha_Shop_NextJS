import useUtils from '@/libs/useUtils'
import { ICostGroup } from '@/models/CostGroupModel'
import { ICost } from '@/models/CostModel'
import { formatPrice } from '@/utils/number'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import CostItem from './CostItem'

interface CostListProps {
  costs: ICost[]
  setCosts: Dispatch<SetStateAction<ICost[]>>
  costGroups: ICostGroup[]
  className?: string
}

function CostList({ costs, setCosts, costGroups, className = '' }: CostListProps) {
  // hooks
  const { handleCopy } = useUtils()

  // states
  const [isAddingCost, setIsAddingCost] = useState<boolean>(false)

  // Group costs by costGroup and calculate total
  const groups = costs.reduce<Record<string, { group: ICostGroup; total: number }>>((acc, cost) => {
    const groupId = cost.costGroup._id
    if (!acc[groupId]) {
      acc[groupId] = { group: cost.costGroup, total: 0 }
    }
    acc[groupId].total += cost.amount
    return acc
  }, {})

  // Convert the grouped object to an array
  const groupedData = Object.values(groups)

  return (
    <div className={`${className}`}>
      <h1 className="flex gap-2.5 text-sm font-semibold">
        <span>
          {' '}
          {costs.length} Cost{costs.length !== 1 ? 's' : ''}
        </span>{' '}
        -{' '}
        <span className="text-rose-500">
          {formatPrice(costs.reduce((total, cost) => total + cost.amount, 0))}
        </span>
      </h1>

      {/* Total cost by cost group */}
      <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1.5">
        {groupedData.map(({ group, total }) => (
          <div
            key={group._id}
            className="flex items-center gap-1.5 rounded-md border-b-2 border-dark bg-gray-100 px-2 py-1 text-xs shadow-md"
          >
            <span
              className="cursor-pointer"
              onClick={() => handleCopy(group.title)}
            >
              {group.title}
            </span>
            <span
              className="cursor-pointer text-rose-500"
              onClick={() => handleCopy(formatPrice(total))}
            >
              {formatPrice(total)}
            </span>
          </div>
        ))}
      </div>

      {/* Costs */}
      <div className="mt-3 flex flex-col gap-1 overflow-y-auto">
        {!isAddingCost ? (
          <button
            className="group flex h-8 w-full items-center gap-2 border-b border-dark px-2.5 text-xs"
            onClick={() => setIsAddingCost(true)}
          >
            <FaPlus
              size={12}
              className="wiggle"
            />
            <span>New Cost</span>
          </button>
        ) : (
          <CostItem
            costGroups={costGroups}
            setCosts={setCosts}
            setIsAddingCost={setIsAddingCost}
          />
        )}
        {costs.map(cost => (
          <CostItem
            cost={cost}
            costGroups={costGroups}
            setCosts={setCosts}
            key={cost._id}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(CostList)
