import { ICostGroup } from '@/models/CostGroupModel'
import { ICost } from '@/models/CostModel'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import CostItem from './CostItem'
import { FaPlus } from 'react-icons/fa'

interface CostListProps {
  costs: ICost[]
  setCosts: Dispatch<SetStateAction<ICost[]>>
  costGroups: ICostGroup[]
  className?: string
}

function CostList({ costs, setCosts, costGroups, className = '' }: CostListProps) {
  // states
  const [isAddingCost, setIsAddingCost] = useState<boolean>(false)

  return (
    <div className={`${className}`}>
      <h1 className="text-sm font-semibold">
        {costs.length} Cost{costs.length !== 1 ? 's' : ''}
      </h1>

      <div className="mt-2 flex flex-col gap-1 overflow-y-auto">
        {costs.map(cost => (
          <CostItem
            cost={cost}
            costGroups={costGroups}
            setCosts={setCosts}
            key={cost._id}
          />
        ))}

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
      </div>
    </div>
  )
}

export default memo(CostList)
