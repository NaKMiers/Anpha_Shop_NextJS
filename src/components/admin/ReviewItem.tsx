'use client'

import { IReview } from '@/models/ReviewModel'
import { editReviewApi } from '@/requests'
import { Rating } from '@mui/material'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSave, FaTrash } from 'react-icons/fa'
import { LuScrollText } from 'react-icons/lu'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'
import Input from '../Input'

interface ReviewItemProps {
  data: IReview
  loadingReviews: string[]
  className?: string

  // selected
  selectedReviews: string[]
  setSelectedReviews: Dispatch<SetStateAction<string[]>>

  // functions
  handleDeleteReviews: (ids: string[]) => void
}

function ReviewItem({
  data,
  loadingReviews,
  className = '',

  // selected
  selectedReviews,
  setSelectedReviews,

  // functions
  handleDeleteReviews,
}: ReviewItemProps) {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [review, setReview] = useState<IReview>(data)
  const [rating, setRating] = useState<number>(review.rating)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'deactivate' | 'delete'>('delete')

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      rating: review.rating,
      content: review.content,
    },
  })

  // MARK: Edit Review
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // nothing change
      if (data.rating === review.rating && data.content === review.content) {
        setEditMode(false)
        return
      }
      if (!editMode) return

      // start editing
      setEditing(true)

      try {
        // edit review
        const { updatedReview, message } = await editReviewApi(review.productId, review._id, {
          rating: data.rating,
          content: data.content,
        })

        // update review list
        setReview(updatedReview)

        // show success message
        toast.success(message)

        // change edit mode
        setEditMode(false)
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // stop editing
        setEditing(false)
      }
    },
    [setReview, setEditMode, review, editMode]
  )

  return (
    <>
      <div
        className={`trans-200 relative flex cursor-pointer items-start justify-between gap-2 rounded-lg p-4 shadow-lg ${
          selectedReviews.includes(review._id) ? '-translate-y-1 bg-violet-50' : 'bg-white'
        } ${className}`}
        onClick={() =>
          setSelectedReviews(prev =>
            prev.includes(review._id) ? prev.filter(id => id !== review._id) : [...prev, review._id]
          )
        }
      >
        <div className="flex w-full flex-col gap-1.5">
          {/* Rating */}
          {editMode ? (
            <Rating
              size="medium"
              name="half-rating"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue as number)
                setValue('rating', newValue)
              }}
            />
          ) : (
            <Rating
              size="medium"
              readOnly
              value={review.rating}
            />
          )}

          {/* Content */}
          {editMode ? (
            <Input
              id="content"
              label="Nội dung"
              register={register}
              errors={errors}
              required
              rows={3}
              type="textarea"
              icon={LuScrollText}
              onFocus={() => clearErrors('content')}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <p
              className="mr-2 inline max-h-[60px] overflow-y-auto font-body text-sm tracking-wider"
              title={review.content}
            >
              {review.content}
            </p>
          )}
        </div>

        {/* MARK: Action Buttons */}
        {['admin', 'editor'].includes(curUser?.role) && (
          <div
            className="flex flex-col gap-3 rounded-lg text-dark sm:flex-row"
            onClick={e => e.stopPropagation()}
          >
            {/* Save Button */}
            {editMode && (
              <button
                className="group block"
                title="Save"
                onClick={handleSubmit(onSubmit)}
                disabled={editing || loadingReviews.includes(review._id)}
              >
                {editing ? (
                  <RiDonutChartFill
                    size={18}
                    className="animate-spin text-slate-300"
                  />
                ) : (
                  <FaSave
                    size={18}
                    className="wiggle text-green-500"
                  />
                )}
              </button>
            )}

            {/* Edit Button Link */}
            <button
              className="group block"
              title="Edit"
              onClick={e => setEditMode(prev => !prev)}
              disabled={loadingReviews.includes(review._id) || editing}
            >
              <MdEdit
                size={18}
                className="wiggle text-sky-500"
              />
            </button>

            {/* Delete Button */}
            <button
              className="group block"
              onClick={e => setIsOpenConfirmModal(true)}
              disabled={loadingReviews.includes(review._id) || editing}
              title="Delete"
            >
              {loadingReviews.includes(review._id) ? (
                <RiDonutChartFill
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : (
                <FaTrash
                  size={18}
                  className="wiggle text-rose-500"
                />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`${confirmType === 'delete' ? 'Xóa' : 'Ẩn'} đánh giá`}
        content={`Bạn có chắc muốn ${confirmType === 'delete' ? 'xóa' : 'ẩn'} đánh giá này không?`}
        onAccept={() => handleDeleteReviews([review._id])}
        isLoading={loadingReviews.includes(review._id)}
      />
    </>
  )
}

export default memo(ReviewItem)
