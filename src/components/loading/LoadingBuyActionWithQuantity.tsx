function BuyActionWithQuantity({ className = '' }: { className?: string }) {
  return (
    <>
      {/* MARK: Main */}
      <div className={`inline-flex gap-[1.5px] rounded-md my-3 ${className}`}>
        <div className={`w-[42px] h-[37px] rounded-tl-md rounded-bl-md loading`} />
        <div className='w-[56px] h-[37px] loading' />
        <div className={`w-[42px] h-[37px] rounded-tr-md rounded-br-md loading`} />
      </div>

      {/* MARK: Action Buttons */}
      <div className='flex items-center flex-row-reverse md:flex-row justify-start gap-3 mt-2'>
        <div className='loading rounded-md text-white w-[113px] h-[38px]' />
        <div className='loading rounded-md text-white w-[46px] h-[38px]' />
      </div>
    </>
  )
}

export default BuyActionWithQuantity
