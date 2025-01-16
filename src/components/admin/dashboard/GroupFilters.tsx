import { ActiveBlockType } from '@/app/(admin)/admin/page'
import { ChartOrderType } from '@/app/api/admin/route'
import { ICategory } from '@/models/CategoryModel'
import { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { formatPrice } from '@/utils/number'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

interface GroupFiltersProps {
  orders: ChartOrderType[]
  activeBlock: ActiveBlockType
  className?: string

  // product
  products: (IProduct & { color: string })[]
  selectedProds: (IProduct & { color: string })[]
  setSelectedProds: Dispatch<SetStateAction<(IProduct & { color: string })[]>>

  // category
  categories: ICategory[]
  selectedCats: ICategory[]
  setSelectedCats: Dispatch<SetStateAction<ICategory[]>>

  // tag
  tags: ITag[]
  selectedTags: ITag[]
  setSelectedTags: Dispatch<SetStateAction<ITag[]>>

  // account email
  aEmails: string[]
  selectedAEmails: string[]
  setSelectedAEmails: Dispatch<SetStateAction<string[]>>
}

function GroupFilters({
  orders,
  activeBlock,
  className = '',

  // product
  products,
  selectedProds,
  setSelectedProds,

  // category
  categories,
  selectedCats,
  setSelectedCats,

  // tag
  tags,
  selectedTags,
  setSelectedTags,

  // account email
  aEmails,
  selectedAEmails,
  setSelectedAEmails,
}: GroupFiltersProps) {
  // states
  const [openProd, setOpenProd] = useState<boolean>(false)
  const [openCat, setOpenCat] = useState<boolean>(false)
  const [openTag, setOpenTag] = useState<boolean>(false)
  const [openAEmail, setOpenAEmail] = useState<boolean>(false)

  // calculate value by active block of each product
  const handleCalcProdValue = useCallback(
    (prod: IProduct) => {
      // filter orders of product
      const filteredOrders: ChartOrderType[] = orders.filter(order =>
        order.products.some(p => p._id.toString() === prod._id.toString())
      )

      let totalValue: number | string = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      switch (activeBlock) {
        case 'revenue':
          totalValue = formatPrice(totalValue)
          break
        case 'orders':
          totalValue = filteredOrders.length
          break
        case 'accounts':
          totalValue = filteredOrders.reduce((total, order) => total + order.quantity, 0)
          break
        case 'vouchers':
          totalValue = filteredOrders.filter(order => order.isVoucher).length
          break
        default:
          break
      }

      return totalValue
    },
    [orders, activeBlock]
  )

  // calculate value by active block of each category
  const handleCalcCateValue = useCallback(
    (cat: ICategory) => {
      // filter orders of category
      const filteredOrders: ChartOrderType[] = orders.filter(order =>
        order.categories.some(c => c._id.toString() === cat._id.toString())
      )

      let totalValue: number | string = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      switch (activeBlock) {
        case 'revenue':
          totalValue = formatPrice(totalValue)
          break
        case 'orders':
          totalValue = filteredOrders.length
          break
        case 'accounts':
          totalValue = filteredOrders.reduce((total, order) => total + order.quantity, 0)
          break
        case 'vouchers':
          totalValue = filteredOrders.filter(order => order.isVoucher).length
          break
        default:
          break
      }

      return totalValue
    },
    [orders, activeBlock]
  )

  // calculate value by active block of each tag
  const handleCalcTagValue = useCallback(
    (tag: ITag) => {
      // filter orders of tag
      const filteredOrders: ChartOrderType[] = orders.filter(order =>
        order.tags.some(t => t._id.toString() === tag._id.toString())
      )

      let totalValue: number | string = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      switch (activeBlock) {
        case 'revenue':
          totalValue = formatPrice(totalValue)
          break
        case 'orders':
          totalValue = filteredOrders.length
          break
        case 'accounts':
          totalValue = filteredOrders.reduce((total, order) => total + order.quantity, 0)
          break
        case 'vouchers':
          totalValue = filteredOrders.filter(order => order.isVoucher).length
          break
        default:
          break
      }

      return totalValue
    },
    [orders, activeBlock]
  )

  // calculate value by active block of each account email
  const handleCalcAEmailValue = useCallback(
    (aEmail: string) => {
      // filter orders of account email
      const filteredOrders: ChartOrderType[] = orders.filter(order => order.accounts.includes(aEmail))

      let totalValue: number | string = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      switch (activeBlock) {
        case 'revenue':
          totalValue = formatPrice(totalValue)
          break
        case 'orders':
          totalValue = filteredOrders.length
          break
        case 'accounts':
          totalValue = filteredOrders.reduce((total, order) => total + order.quantity, 0)
          break
        case 'vouchers':
          totalValue = filteredOrders.filter(order => order.isVoucher).length
          break
        default:
          break
      }

      return totalValue
    },
    [orders, activeBlock]
  )

  // render filter group
  const renderFilterGroup = useCallback(
    (
      open: boolean,
      setOpen: any,
      list: any[],
      selectedList: any[],
      setSelectedList: any,
      handleCalc: any,
      isObjectItem: boolean,
      pluralNoun: string,
      singleNoun: string
    ) => (
      <div className="relative">
        <button
          className="trans-200 rounded-md px-2 py-1.5 text-xs font-semibold shadow-md hover:bg-slate-100"
          onClick={() => list.length > 0 && setOpen(!open)}
        >
          {selectedList.length} {selectedList.length !== 0 ? pluralNoun : singleNoun}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex max-w-[calc(100vw-2*21px)] flex-col gap-0.5 overflow-auto rounded-md bg-white shadow-md"
            >
              <button
                className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                  selectedList.length === list.length ? 'border-l-2 border-primary pl-2' : ''
                }`}
                onClick={() =>
                  selectedList.length === list.length ? setSelectedList([]) : setSelectedList(list)
                }
              >
                <span className="text-nowrap">All</span>
              </button>
              {list.map((item, index) => (
                <button
                  className={`trans-200 trans-200 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                    (
                      isObjectItem
                        ? selectedList.some(ele => ele._id.toString() === item._id.toString())
                        : selectedList.includes(item)
                    )
                      ? 'border-l-2 border-primary pl-2'
                      : ''
                  }`}
                  onClick={() =>
                    isObjectItem
                      ? setSelectedList((prev: any) =>
                          prev.some((ele: any) => ele._id.toString() === item._id.toString())
                            ? prev.filter((ele: any) => ele._id.toString() !== item._id.toString())
                            : [...prev, item]
                        )
                      : setSelectedList((prev: any) =>
                          prev.includes(item) ? prev.filter((e: any) => e !== item) : [...prev, item]
                        )
                  }
                  key={index}
                >
                  <p
                    className="text-nowrap"
                    style={{ color: item?.color || '#333' }}
                  >
                    {isObjectItem ? item.title : item}
                  </p>
                  <p className="text-nowrap font-normal">{handleCalc(item)}</p>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ),
    []
  )

  return (
    <div className={`${className}`}>
      {(openProd || openCat || openTag || openAEmail) && (
        <div
          className="fixed left-0 top-0 z-10 h-screen w-screen"
          onClick={() => {
            setOpenProd(false)
            setOpenCat(false)
            setOpenTag(false)
            setOpenAEmail(false)
          }}
        />
      )}

      {/* MARK: Products */}
      {renderFilterGroup(
        openProd,
        setOpenProd,
        products,
        selectedProds,
        setSelectedProds,
        handleCalcProdValue,
        true,
        'products',
        'product'
      )}

      {/* MARK: Categories */}
      {renderFilterGroup(
        openCat,
        setOpenCat,
        categories,
        selectedCats,
        setSelectedCats,
        handleCalcCateValue,
        true,
        'categories',
        'category'
      )}

      {/* MARK: Tags */}
      {renderFilterGroup(
        openTag,
        setOpenTag,
        tags,
        selectedTags,
        setSelectedTags,
        handleCalcTagValue,
        true,
        'tags',
        'tag'
      )}

      {/* MARK: Account Email */}
      {renderFilterGroup(
        openAEmail,
        setOpenAEmail,
        aEmails,
        selectedAEmails,
        setSelectedAEmails,
        handleCalcAEmailValue,
        false,
        'emails',
        'email'
      )}
    </div>
  )
}

export default memo(GroupFilters)
