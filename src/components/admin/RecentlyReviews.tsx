import { IProduct } from '@/models/ProductModel'
import { IReview } from '@/models/ReviewModel'
import { changeReviewStatusApi, deleteReviewsApi, getRecentlyReviewsApi } from '@/requests'
import { memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ReviewItem from './ReviewItem'

interface RecentlyReviewsProps {
  className?: string
}

function RecentlyReviews({ className }: RecentlyReviewsProps) {
  // states
  const [reviews, setReviews] = useState<IReview[]>([])
  const [loadingReviews, setLoadingReviews] = useState<string[]>([])

  // filter states
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState<'createdAt|1' | 'createdAt|-1'>('createdAt|-1')
  const [status, setStatus] = useState<'' | 'show' | 'hide' | 'pinned'>('show')

  // handle get recently reviews
  const handleGetRecentlyReviews = useCallback(
    async (
      limit: number,
      page: number,
      sort: 'createdAt|1' | 'createdAt|-1',
      status: '' | 'show' | 'hide' | 'pinned'
    ) => {
      let query = '?'
      if (limit) query += `limit=${limit}&`
      if (page) query += `page=${page}&`
      if (sort) query += `sort=${sort}&`
      if (status) query += `status=${status}`

      try {
        const { reviews } = await getRecentlyReviewsApi(query)
        setReviews(reviews)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    },
    []
  )

  // get recently reviews
  useEffect(() => {
    handleGetRecentlyReviews(10, 1, 'createdAt|-1', 'show')
  }, [handleGetRecentlyReviews])

  // change review status
  const handleChangeReviewStatus = useCallback(
    async (ids: string[], status: 'show' | 'hide' | 'pinned') => {
      try {
        // change status
        const { message } = await changeReviewStatusApi(ids, status)

        // update review status
        setReviews(prev =>
          prev.map(review =>
            ids.includes(review._id)
              ? {
                  ...review,
                  status,
                }
              : review
          )
        )

        // show success message
        toast.success(message)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      }
    },
    []
  )

  // delete reviews
  const handleDeleteReviews = useCallback(
    async (ids: string[]) => {
      // find product id
      const reviewId = ids[0]
      const productId = reviews.find(review => review._id.toString() === reviewId)?.productId

      if (!productId) {
        toast.error('Not implemented yet!')
        return
      }

      setLoadingReviews(ids)

      try {
        // send request to server
        const { deletedReviews, message } = await deleteReviewsApi(productId, ids)

        // remove deleted products from state
        setReviews(prev =>
          prev.filter(
            product => !deletedReviews.map((product: IProduct) => product._id).includes(product._id)
          )
        )

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        setLoadingReviews([])
      }
    },
    [reviews]
  )

  return (
    <div
      className={`rounded-lg border-2 border-slate-300 bg-neutral-950 p-21/2 pt-1 shadow-lg ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-21 gap-y-1">
        <h2 className="font-semibold italic text-light">Recently Reviews</h2>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-300">Items/Page</span>
            <input
              className="w-[50px] rounded-md border border-slate-500 px-1.5 py-1 text-xs text-slate-500 outline-none"
              type="number"
              max={20}
              min={1}
              value={limit}
              onChange={e => setLimit(+e.target.value > 20 ? 20 : +e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-300">Page</span>
            <input
              className="w-[50px] rounded-md border border-slate-500 px-1.5 py-1 text-xs text-slate-500 outline-none"
              type="number"
              min={1}
              value={page}
              onChange={e => setPage(+e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-300">Sort</span>
            <select
              className="rounded-md border border-slate-500 px-1.5 py-1 text-xs text-slate-500 outline-none"
              value={sort}
              onChange={e => setSort(e.target.value as any)}
            >
              <option value="createdAt|-1">Newest</option>
              <option value="createdAt|1">Latest</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-300">Status</span>
            <select
              className="rounded-md border border-slate-500 px-1.5 py-1 text-xs text-slate-500 outline-none"
              value={status}
              onChange={e => setStatus(e.target.value as any)}
            >
              <option value="">All</option>
              <option value="show">Show</option>
              <option value="hide">Hide</option>
              <option value="pinned">Pinned</option>
            </select>
          </div>

          <button
            className="trans-200 rounded-md border border-primary bg-primary/30 px-1.5 py-1 text-xs text-primary hover:bg-primary hover:text-light"
            onClick={() => handleGetRecentlyReviews(limit, page, sort, status)}
          >
            Apply
          </button>
        </div>
      </div>

      <div className="mt-2 flex max-h-[264px] flex-col gap-2 overflow-y-auto">
        {reviews.map(review => (
          <ReviewItem
            data={review}
            loadingReviews={loadingReviews}
            selectedReviews={[]}
            setSelectedReviews={() => {}}
            handleChangeReviewStatus={handleChangeReviewStatus}
            handleDeleteReviews={handleDeleteReviews}
            key={review._id}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(RecentlyReviews)
