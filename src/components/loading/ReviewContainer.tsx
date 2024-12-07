'use client'

import { IReview } from '@/models/ReviewModel'
import { checkUserReviewedApi, getAllProductReviewsApi } from '@/requests'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Review from '../Review'
import { Rating } from '@mui/material'
import { FaStar } from 'react-icons/fa'
import ReviewModal from '../admin/ReviewModal'
import { RiDonutChartFill } from 'react-icons/ri'
import Divider from '../Divider'
import { IProduct } from '@/models/ProductModel'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

interface ReviewContainerProps {
  product: IProduct
  className?: string
}

function ReviewContainer({ product, className = '' }: ReviewContainerProps) {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [reviews, setReviews] = useState<IReview[]>([])
  const [stars, setStarts] = useState<number[]>([])
  const [starShowed, setStarShowed] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [prevReview, setPrevReview] = useState<IReview | null>(null)

  // loading & modal states
  const [getting, setGetting] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [openAddReviewModal, setOpenAddReviewModal] = useState<boolean>(false)
  const [isReviewed, setIsReviewed] = useState<boolean>(false)

  // check if user is reviewed this product
  useEffect(() => {
    const checkUserReviewed = async () => {
      try {
        const { isReviewed, review } = await checkUserReviewedApi(product._id)
        setIsReviewed(isReviewed)

        if (review) {
          setPrevReview(review)
        }
      } catch (err: any) {
        console.log(err)
      }
    }

    if (curUser?._id) {
      checkUserReviewed()
    }
  }, [curUser])

  // get all product reviews
  useEffect(() => {
    const getAllProductReviews = async () => {
      // start getting
      page === 1 ? setGetting(true) : setLoadingMore(true)

      try {
        let query = `?page=${page}`
        if (starShowed !== 0) {
          query += `&rating=${starShowed}`
        }

        const { reviews, stars } = await getAllProductReviewsApi(product._id, query)

        // update review states
        setReviews(prev => (page > 1 ? [...prev, ...reviews] : reviews))
        setStarts(stars)
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop loading
        setGetting(false)
        setLoadingMore(false)
      }
    }

    getAllProductReviews()
  }, [starShowed, page])

  return (
    <div>
      <div className="flex flex-col gap-3 text-center md:flex-row">
        <div className="flex w-full flex-col items-center justify-center gap-2 md:max-w-[200px]">
          <p className="text-3xl font-semibold">{Math.round(product.rating * 100) / 100 || 5}</p>
          <Rating
            size="small"
            readOnly
            value={4.85}
          />
          <p className="text-sm text-slate-500">
            {product.reviewAmount < 0 ? 0 : product.reviewAmount} reviews
          </p>
        </div>
        <ul className="group flex flex-1 flex-col gap-1.5">
          {stars.map((value, index) => (
            <li
              className={`trans-200 flex cursor-pointer items-center gap-2 hover:!opacity-100 group-hover:opacity-30 ${starShowed === 0 ? 'opacity-100' : starShowed === 5 - index ? 'opacity-100' : 'opacity-30'}`}
              onClick={() => {
                if (starShowed === 5 - index) {
                  setStarShowed(0)
                  return
                }
                setStarShowed(5 - index)
                setPage(1)
              }}
              key={index}
            >
              <span className="text-sm font-semibold">{5 - index}</span>
              <FaStar
                size={18}
                className="text-yellow-400"
              />
              <div className="relative h-2.5 w-full flex-1 overflow-hidden rounded-lg bg-slate-200">
                <div
                  className="absolute left-0 top-0 h-full bg-yellow-400"
                  style={{
                    width: (value / stars.reduce((acc, value) => acc + value, 0)) * 100 + '%',
                  }}
                />
              </div>
              <span className="w-[50px] text-left text-sm text-slate-500">({value})</span>
            </li>
          ))}
        </ul>
        <div className="flex w-full flex-col items-center justify-center gap-2 md:max-w-[200px]">
          <p className="font-semibold text-slate-500">Chia sẻ trãi nghiệm của bạn</p>
          <Rating
            size="small"
            value={5}
            readOnly
          />
          <button
            className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-light shadow-md"
            onClick={() => {
              if (!curUser?._id) {
                toast.error('Vui lòng đăng nhập để đánh giá sản phẩm')
                return
              }

              if (isReviewed) {
                toast.error('Bạn chỉ có thể đánh giá sản phẩm này một lần')
                return
              }

              setOpenAddReviewModal(true)
            }}
          >
            Đánh giá
          </button>
        </div>
      </div>

      {/* Add Review */}
      <ReviewModal
        open={openAddReviewModal}
        setOpen={setOpenAddReviewModal}
        productId={product._id}
        setReviews={setReviews}
      />

      {getting ? (
        <div className="mt-3 flex items-center justify-center p-21">
          <RiDonutChartFill
            size={100}
            className="animate-spin text-slate-300"
          />
        </div>
      ) : (
        <div className={`mt-3 flex flex-col gap-2 ${className}`}>
          {prevReview && (
            <div className="rounded-lg border-2 bg-dark-100 p-3">
              <p className="mb-2 text-sm text-slate-200">Đánh giá của tôi</p>
              <Review
                data={prevReview}
                setPrevReview={setPrevReview}
                setReviews={setReviews}
                setIsReviewed={setIsReviewed}
                className="bg-white"
                key={prevReview._id}
              />
            </div>
          )}

          {reviews.map(review => (
            <Review
              data={review}
              key={review._id}
              setPrevReview={setPrevReview}
              setReviews={setReviews}
              setIsReviewed={setIsReviewed}
            />
          ))}
        </div>
      )}

      <Divider size={5} />

      {(starShowed > 0
        ? stars[5 - starShowed] > reviews.length
        : stars.reduce((acc, value) => acc + value, 0) > reviews.length) && (
        <div className="flex items-center justify-center">
          <button
            className="rounded-md bg-dark-100 px-4 py-2 text-sm font-semibold text-light"
            onClick={() => setPage(prev => prev + 1)}
            disabled={loadingMore || getting}
          >
            {loadingMore ? (
              <RiDonutChartFill
                size={20}
                className="animate-spin"
              />
            ) : (
              'Tải thêm'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(ReviewContainer)
