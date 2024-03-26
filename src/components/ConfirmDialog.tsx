import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setOpenConfirm } from '@/libs/reducers/modalReducer'
import { useEffect, useRef } from 'react'
import { RiDonutChartFill } from 'react-icons/ri'

interface ConfirmDialogProps {
  title: string
  content: string
  acceeptLabel?: string
  cancelLabel?: string
  onAccept: () => void
  className?: string
  isLoading?: boolean
}

function ConfirmDialog({
  title,
  content,
  acceeptLabel,
  cancelLabel,
  onAccept,
  isLoading = false,
  className = '',
}: ConfirmDialogProps) {
  // hook
  const dispatch = useAppDispatch()
  const isOpenConfirmModal = useAppSelector(state => state.modal.isOpenConfirm)

  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpenConfirmModal) {
      // show modal
      modalRef.current?.classList.remove('hidden')
      modalRef.current?.classList.add('flex')

      setTimeout(() => {
        // fade in modal
        modalRef.current?.classList.remove('opacity-0')

        // float in modal body
        modalBodyRef.current?.classList.remove('opacity-0')
        modalBodyRef.current?.classList.remove('translate-y-8')
      }, 1)
    } else {
      // fade out modal
      modalRef.current?.classList.add('opacity-0')

      // float out modal body
      modalBodyRef.current?.classList.add('opacity-0')
      modalBodyRef.current?.classList.add('translate-y-8')

      setTimeout(() => {
        // hide modal
        modalRef.current?.classList.add('hidden')
        modalRef.current?.classList.remove('flex')
      }, 350)
    }
  }, [isOpenConfirmModal])

  return (
    <div
      className='fixed z-10 top-0 left-0 h-screen text-dark w-screen hidden items-center justify-center p-21 bg-black bg-opacity-10 opacity-0 transition-all duration-300'
      ref={modalRef}>
      <div
        className={`rounded-medium shadow-medium-light bg-white p-21 max-w-[500px] w-full max-h-[500px] opacity-0 transition-all duration-300 translate-y-8 ${className}`}
        ref={modalBodyRef}>
        <h2 className='text-2xl font-semibold tracking-wide'>{title}</h2>
        <hr className='my-2' />

        <p className='font-body tracking-wide'>{content}</p>

        <hr className='my-2' />

        <div className='flex items-center justify-end gap-3 select-none'>
          <button
            className={`rounded-lg shadow-lg px-3 py-2 border border-slate-300 hover:bg-slate-300 hover:text-white common-transition ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            onClick={() => dispatch(setOpenConfirm(false))}
            disabled={isLoading}>
            {cancelLabel || 'Hủy'}
          </button>
          <button
            className={`rounded-lg shadow-lg px-3 py-2 border text-rose-500 hover:bg-rose-400 hover:text-white common-transition ${
              isLoading ? 'pointer-events-none border-slate-300' : 'border-rose-500'
            }`}
            onClick={onAccept}
            disabled={isLoading}>
            {isLoading ? (
              <RiDonutChartFill size={24} className='animate-spin text-slate-300' />
            ) : (
              acceeptLabel || 'Đồng ý'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
