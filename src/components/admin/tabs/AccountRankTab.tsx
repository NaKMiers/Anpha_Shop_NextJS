import { ChartOrderType } from '@/app/api/admin/route'
import { ICategory } from '@/models/CategoryModel'
import { formatPrice } from '@/utils/number'
import { memo } from 'react'

export type AccountRankGroupType = {
  email: string
  revenue: number
  categories: ICategory[]
}

interface AccountRankTabProps {
  orders: ChartOrderType[]
  loading: boolean
  className?: string
}

function AccountRankTab({ orders, loading, className = '' }: AccountRankTabProps) {
  const groupOrdersByEmail = (orders: ChartOrderType[]): AccountRankGroupType[] => {
    const emailGroups: Record<string, AccountRankGroupType> = {}

    orders.forEach(order => {
      const { accounts, total, categories } = order

      accounts.forEach(email => {
        if (!emailGroups[email]) {
          emailGroups[email] = {
            email,
            revenue: 0,
            categories: [],
          }
        }

        // Increment revenue for the email
        emailGroups[email].revenue += total

        // Add unique categories to the email
        const existingCategories = emailGroups[email].categories
        const uniqueCategories = categories.filter(
          category => !existingCategories.some(c => c._id === category._id)
        )
        emailGroups[email].categories.push(...uniqueCategories)
      })
    })

    // Convert the record to an array
    return Object.values(emailGroups)
  }

  const groupedData = groupOrdersByEmail(orders)

  return (
    <div className={`${className} ${loading ? 'animate-pulse' : ''}`}>
      {groupedData.map((aEmail, index) => (
        <div
          className="mb-3 flex flex-col items-start gap-2"
          key={index}
        >
          {/* Render email */}
          <p className="rounded-lg bg-slate-700 px-2 py-[2px] text-sm text-white">{aEmail.email}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-green-500">{formatPrice(aEmail.revenue)}</span>
            {aEmail.categories.map((category, index) => (
              <span
                className="tex-dark rounded-md border-2 bg-white px-1 text-[11px]"
                style={{
                  color: category.color,
                  borderColor: category.color,
                }}
                key={index}
              >
                {category.title}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(AccountRankTab)
