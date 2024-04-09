import { IUser } from '@/models/UserModel'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaHeart, FaRegHeart, FaSortDown } from 'react-icons/fa'
import LoadingButton from './LoadingButton'
import toast from 'react-hot-toast'
import { FullyComment } from './Comment'
import { format } from 'timeago.js'
import { hideCommentApi, likeCommentApi, replyCommentApi } from '@/requests/commentRequest'
import { useSession } from 'next-auth/react'

interface CommentItemProps {
  comment: FullyComment
  setCmts: React.Dispatch<React.SetStateAction<FullyComment[]>>
  className?: string
}

function CommentItem({ comment, setCmts, className = '' }: CommentItemProps) {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // values
  const user = comment.user

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      comment: '',
    },
  })

  // handle reply comment
  const replyComment: SubmitHandler<FieldValues> = useCallback(
    async data => {
      setIsLoading(true)

      console.log(data)

      try {
        // send request to add comment
        const { newComment } = await replyCommentApi(comment._id, data.comment)
        newComment.user = curUser

        // add new comment to list
        setCmts(prev => [newComment, ...prev])
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [comment._id, setCmts, curUser]
  )

  // like / unlike comment
  const likeComment = useCallback(
    async (value: 'y' | 'n') => {
      try {
        // send request to like / dislike comment
        const { comment: cmt } = await likeCommentApi(comment._id, value)

        // update comment
        setCmts(prev => prev.map(comment => (comment._id === cmt._id ? cmt : comment)))
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      }
    },
    [comment._id, setCmts]
  )

  // hide / show comment
  const hideComment = useCallback(
    async (value: 'y' | 'n') => {
      try {
        // send request to hide / show comment
        const { comment: cmt } = await hideCommentApi(comment._id, value)

        // update comment
        setCmts(prev => prev.map(comment => (comment._id === cmt._id ? cmt : comment)))
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      }
    },
    [comment._id, setCmts]
  )

  return (
    <div className='w-full flex items-start gap-3'>
      <Image
        className={`rounded-full shadow-lg ${className}`}
        src={user.avatar || '/images/default-avatar.jpg'}
        width={40}
        height={40}
        alt='avatar'
      />

      <div className='w-full'>
        <div className=''>
          <span className='font-semibold'>
            {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username}
          </span>{' '}
          - <span className='text-slate-500 text-sm'>{format(comment.createdAt)}</span>{' '}
          <button
            className={`ml-2 px-[6px] py-[1px] rounded-[4px] text-sm border ${
              comment.hide
                ? 'border-rose-500 hover:bg-rose-500 text-rose-500'
                : 'border-green-500 hover:bg-green-500 text-green-500'
            } hover:text-white common-transition`}
            onClick={() => hideComment(comment.hide ? 'n' : 'y')}>
            {comment.hide ? 'hiding' : 'showing'}
          </button>
        </div>

        <p className='font-body tracking-tide'>{comment.content}</p>

        <div className='flex items-center gap-3 text-sm'>
          <div className='flex items-center font-semibold gap-1'>
            {comment.likes.includes(curUser?._id) ? (
              <FaHeart
                size={14}
                className='h-[14px] text-secondary cursor-pointer hover:scale-110 common-transition'
                onClick={() => likeComment('n')}
              />
            ) : (
              <FaRegHeart
                size={14}
                className='w-4 h-[14px] text-secondary cursor-pointer hover:scale-110 common-transition'
                onClick={() => likeComment('y')}
              />
            )}{' '}
            <span>0</span>
          </div>

          <div
            className='flex font-semibold text-primary gap-1 cursor-pointer select-none'
            onClick={() => setIsOpenReply(prev => !prev)}>
            <span>0</span>
            <span className=''>Phản hồi</span>
            <FaSortDown />
          </div>
        </div>

        {/* Reply Section */}
        <div
          className={`${
            isOpenReply ? 'max-h-[300px]' : 'max-h-0'
          } relative h-full overflow-y-scroll common-transition mt-1 `}>
          <div className='sticky z-10 top-0 flex items-start gap-2 bg-white'>
            <Image
              className={`rounded-full shadow-lg ${className}`}
              src={'/images/default-avatar.jpg'}
              width={24}
              height={24}
              alt='avatar'
            />
            <div className='w-full'>
              <input
                id='comment'
                className='px-2 py-1 border-b w-full text-sm text-dark focus:outline-none focus:ring-0 peer'
                placeholder=' '
                disabled={isLoading}
                type='text'
                {...register('comment', { required: true })}
                onWheel={e => e.currentTarget.blur()}
              />
              <div className='flex gap-2 mt-2 justify-end'>
                <button className='h-[30px] text-sm px-3 rounded-lg hover:bg-slate-200 common-transition'>
                  Hủy
                </button>
                <LoadingButton
                  className='h-[30px] text-sm px-3 border border-primary hover:bg-primary text-primary hover:text-white rounded-lg common-transition'
                  onClick={handleSubmit(replyComment)}
                  text='Gửi'
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Replied Comments */}
          <div className='relative flex flex-col gap-3 pl-21 mt-1'>
            {comment.replied.map((comment: FullyComment) => (
              <div key={comment._id} className='flex items-start gap-3'>
                <Image
                  className={`rounded-full shadow-lg ${className}`}
                  src={'/images/default-avatar.jpg'}
                  width={24}
                  height={24}
                  alt='avatar'
                />
                <div className='w-full'>
                  <div className='flex items-center gap-1'>
                    <span className='font-semibold'>
                      {user.firstname && user.lastname
                        ? `${user.firstname} ${user.lastname}`
                        : user.username}
                    </span>{' '}
                    -<span className='text-sm text-slate-500'>{format(comment.createdAt)}</span>
                  </div>
                  <p className='font-body tracking-tide'>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentItem
