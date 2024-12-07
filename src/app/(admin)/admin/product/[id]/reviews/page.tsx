'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import ReviewItem from '@/components/admin/ReviewItem'
import ReviewModal from '@/components/admin/ReviewModal'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IProduct } from '@/models/ProductModel'
import { IReview } from '@/models/ReviewModel'
import { deleteReviewsApi, getAllProductReviewsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSort } from 'react-icons/fa'

function AllProductReviewsPage({
  params: { id: productId },
  searchParams,
}: {
  params: { id: string }
  searchParams?: { [key: string]: string[] | string }
}) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [reviews, setReviews] = useState<IReview[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])

  // loading and confirming
  const [openAddReviewModal, setOpenAddReviewModal] = useState<boolean>(false)
  const [loadingReviews, setLoadingReviews] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 50

  // Form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      sort: 'updatedAt|-1',
      status: '',
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

  // get all product reviews
  useEffect(() => {
    // get all products
    const getAllProductReviews = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all product reviews
        const { reviews, amount } = await getAllProductReviewsApi(productId, query)

        // set products to state
        setReviews(reviews)
        setAmount(amount)

        // sync search params with states
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('status', searchParams?.status || getValues('status'))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllProductReviews()
  }, [dispatch, setValue, getValues, searchParams, productId])

  // delete reviews
  const handleDeleteReviews = useCallback(
    async (ids: string[]) => {
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
        setSelectedReviews([])
      }
    },
    [productId]
  )

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // reset page
      if (searchParams?.page) {
        delete searchParams.page
      }

      // loop through data to prevent filter default
      for (let key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key]
          } else {
            data[key] = ''
          }
        }
      }

      return {
        ...data,
      }
    },
    [searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedReviews(prev =>
          prev.length === reviews.length ? [] : reviews.map(product => product._id)
        )
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, reviews, handleSubmit])

  return (
    <div className="w-full">
      {/* Top & Pagination */}
      <AdminHeader
        title="All Reviews"
        backLink="/admin/product/all"
      />
      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      {/* Filter */}
      <AdminMeta
        handleFilter={handleSubmit(handleFilter)}
        handleResetFilter={handleResetFilter}
      >
        {/* Select Filter */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-3 md:col-span-8">
          {/* Sort */}
          <Input
            id="sort"
            label="Sort"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('sort')}
            options={[
              {
                value: 'createdAt|-1',
                label: 'Newest',
              },
              {
                value: 'createdAt|1',
                label: 'Oldest',
              },
              {
                value: 'updatedAt|-1',
                label: 'Latest',
                selected: true,
              },
              {
                value: 'updatedAt|1',
                label: 'Earliest',
              },
            ]}
          />

          {/* Status */}
          <Input
            id="status"
            label="Status"
            disabled={false}
            register={register}
            errors={errors}
            icon={FaSort}
            type="select"
            onFocus={() => clearErrors('status')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'show',
                label: 'Show',
              },
              {
                value: 'hide',
                label: 'Hide',
              },
            ]}
            className="min-w-[104px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-white"
            onClick={() =>
              setSelectedReviews(selectedReviews.length > 0 ? [] : reviews.map(review => review._id))
            }
          >
            {selectedReviews.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedReviews.length && (
            <button
              className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => setIsOpenConfirmModal(true)}
            >
              Delete
            </button>
          )}
        </div>
      </AdminMeta>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete Reviews"
        content="Are you sure that you want to delete these reviews?"
        onAccept={() => handleDeleteReviews(selectedReviews)}
        isLoading={loadingReviews.length > 0}
      />

      {/* Amount */}
      <div className="flex items-center justify-between gap-21">
        <button
          className="rounded-md bg-yellow-500 px-2 py-1 text-sm font-semibold text-dark shadow-md"
          onClick={() => setOpenAddReviewModal(true)}
        >
          Add Review
        </button>

        <div className="p-3 text-right text-sm font-semibold text-white">
          {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} review
          {amount > 1 ? 's' : ''}
        </div>
      </div>

      {/* Add Review */}
      <ReviewModal
        open={openAddReviewModal}
        setOpen={setOpenAddReviewModal}
        productId={productId}
        setReviews={setReviews}
      />

      {/* MAIN LIST */}
      <div className="flex flex-col gap-2">
        {reviews.map(review => (
          <ReviewItem
            data={review}
            loadingReviews={loadingReviews}
            selectedReviews={selectedReviews}
            setSelectedReviews={setSelectedReviews}
            handleDeleteReviews={handleDeleteReviews}
            key={review._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllProductReviewsPage
