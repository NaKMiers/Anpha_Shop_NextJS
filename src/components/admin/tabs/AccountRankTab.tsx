import { ChartOrderType } from '@/app/api/admin/route'
import { ICategory } from '@/models/CategoryModel'
import { formatPrice } from '@/utils/number'
import { memo } from 'react'

export type AccountRankGroupType = {
  email: string
  revenue: number
  category: ICategory
}

interface AccountRankTabProps {
  orders: ChartOrderType[]
  loading: boolean
  className?: string
}

function AccountRankTab({ orders, loading, className = '' }: AccountRankTabProps) {
  // groups order by emails in order.accounts
  const groupOrdersByEmail = (orders: ChartOrderType[]): AccountRankGroupType[] => {
    const emailMap: Map<string, { revenue: number; categoryCount: Map<ICategory, number> }> = new Map()

    // Process each order
    orders.forEach(order => {
      order.accounts.forEach(email => {
        // Initialize email entry if not present
        if (!emailMap.has(email)) {
          emailMap.set(email, { revenue: 0, categoryCount: new Map() })
        }

        // Update revenue
        const emailData = emailMap.get(email)!
        emailData.revenue += order.total

        // Update category counts
        order.categories.forEach(category => {
          emailData.categoryCount.set(category, (emailData.categoryCount.get(category) || 0) + 1)
        })
      })
    })

    // Transform map into AccountRankGroupType array
    const result: AccountRankGroupType[] = []
    emailMap.forEach((data, email) => {
      // Find the most frequent category
      const mostFrequentCategory = Array.from(data.categoryCount.entries()).reduce(
        (prev, curr) => (curr[1] > prev[1] ? curr : prev),
        [null, 0] as [ICategory | null, number]
      )[0]

      result.push({
        email,
        revenue: data.revenue,
        category: mostFrequentCategory!,
      })
    })

    return result
  }

  const groupedData = groupOrdersByEmail(orders)

  return (
    <div className={`${className} ${loading ? 'animate-pulse' : ''}`}>
      {groupedData.map((aEmail, index) => (
        <div
          className="mb-3 flex flex-col items-start gap-1"
          key={index}
        >
          <p className="rounded-lg bg-slate-700 px-2 py-[2px] text-sm text-white">{aEmail.email}</p>
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-green-500">{formatPrice(aEmail.revenue)}</span>
            <span
              className="tex-dark rounded-md border-2 bg-white px-1 text-[11px]"
              style={{
                color: aEmail.category.color,
                borderColor: aEmail.category.color,
              }}
            >
              {aEmail.category.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(AccountRankTab)
