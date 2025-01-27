import { BlocksType } from '@/app/api/admin/route'
import { formatPrice } from '@/utils/number'
import { Dispatch, memo, ReactNode, SetStateAction, useCallback } from 'react'

export type ActiveBlockType =
  | 'revenue'
  | 'profit'
  | 'costs'
  | 'orders'
  | 'accounts'
  | 'customers'
  | 'vouchers'

interface BlocksProps {
  activeBlock: ActiveBlockType
  selectedBlocks: ActiveBlockType[]
  setActiveBlock: Dispatch<SetStateAction<ActiveBlockType>>
  blocks: BlocksType | null
  loading: boolean
  className?: string
}

function Blocks({
  blocks,
  activeBlock,
  selectedBlocks,
  setActiveBlock,
  loading,
  className = '',
}: BlocksProps) {
  // render block
  const renderBlock = useCallback(
    (children: ReactNode, name: ActiveBlockType, disabled: boolean = false) =>
      selectedBlocks.includes(name) && (
        <button
          className={`${activeBlock === name ? 'bg-dark-100 text-white' : ''} trans-200 flex flex-col rounded-lg px-21 py-3 text-sm shadow-lg`}
          disabled={loading || disabled}
          onClick={() => setActiveBlock(name)}
        >
          {children}
        </button>
      ),
    [setActiveBlock, activeBlock, selectedBlocks, loading]
  )

  return (
    <div className={`${className}`}>
      {/* Revenue */}
      {renderBlock(
        <>
          <span className="font-bold tracking-wider">Revenue</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{formatPrice(blocks.revenue)}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[100px] rounded-md shadow-sm shadow-light" />
          )}
        </>,
        'revenue'
      )}

      {/* Profit */}
      {renderBlock(
        <>
          <span className="font-bold tracking-wider">Profit</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{formatPrice(blocks.revenue - blocks.costs)}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[100px] rounded-md shadow-sm shadow-light" />
          )}
        </>,
        'profit'
      )}

      {/* Costs */}
      {renderBlock(
        <>
          <span className="font-bold tracking-wider">Costs</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{formatPrice(blocks.costs)}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[100px] rounded-md shadow-sm shadow-light" />
          )}
        </>,
        'costs'
      )}

      {/* Orders */}
      {renderBlock(
        <>
          <span className="font-bold tracking-wider">Orders</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{blocks.orders}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[60px] rounded-md shadow-sm shadow-light" />
          )}
        </>,
        'orders'
      )}

      {/* Accounts */}
      {renderBlock(
        <>
          <span className="font-bold tracking-wider">Accounts</span>
          {blocks && !loading ? (
            <span className="mt-1 font-semibold">{blocks.accounts}</span>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[60px] rounded-md shadow-sm shadow-light" />
          )}
        </>,
        'accounts'
      )}

      {/* Customers */}
      {renderBlock(
        <>
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
        </>,
        'customers',
        true
      )}

      {/* Vouchers */}
      {renderBlock(
        <>
          <span className="font-bold tracking-wider">Vouchers</span>

          {blocks && !loading ? (
            <p className="mt-1 font-semibold">
              <span>{blocks.vouchers}</span> - <span>{formatPrice(blocks.voucherDiscount)}</span>
            </p>
          ) : (
            <div className="loading mt-1 h-4 w-full max-w-[115px] rounded-md shadow-sm shadow-light" />
          )}
        </>,
        'vouchers'
      )}
    </div>
  )
}

export default memo(Blocks)
