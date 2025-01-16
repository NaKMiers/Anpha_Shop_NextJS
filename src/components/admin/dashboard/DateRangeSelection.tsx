import { getRangeOptions } from '@/constants'
import { AnimatePresence, motion } from 'framer-motion'
import { default as momentTZ } from 'moment-timezone'
import { memo, useCallback, useEffect, useState } from 'react'
import { DateRange, RangeKeyDict } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { FaCalendarAlt, FaCircleNotch } from 'react-icons/fa'

interface DateRangeProps {
  range: any
  setRange: any
  setValue: (name: string, value: any) => void
  handleFilter: () => void
  className?: string
}

function DateRangeSelection({
  range,
  setRange,
  setValue,
  handleFilter,
  className = '',
}: DateRangeProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)
  const [openOptions, setOpenOptions] = useState<boolean>(false)
  const [selectedRangeOption, setSelectedRangeOption] = useState<string>('Today')
  const [monthsToShow, setMonthsToShow] = useState<number>(2)

  // handle select date range
  const handleSelect = useCallback(
    (ranges: RangeKeyDict) => {
      setRange([ranges.selection])
      setValue('from', ranges.selection.startDate)
      setValue('to', ranges.selection.endDate)
    },
    [setRange, setValue]
  )

  // resize event listener
  useEffect(() => {
    const updateMonthsToShow = () => {
      setMonthsToShow(window.innerWidth <= 768 ? 1 : 2)
    }

    window.addEventListener('resize', updateMonthsToShow)
    updateMonthsToShow()

    return () => {
      window.removeEventListener('resize', updateMonthsToShow)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <button
        className="group flex items-center justify-center gap-1 rounded-md p-1.5 shadow-md"
        onClick={() => setOpen(true)}
      >
        <FaCalendarAlt
          size={13}
          className="wiggle"
        />
        <span className="text-xs font-semibold">
          {momentTZ(range[0].startDate).format('MMM D')} -{' '}
          {momentTZ(range[0].endDate).format('MMM D, YYYY')}
        </span>
      </button>

      {/* overlay */}
      {open && (
        <div
          className="fixed left-0 top-0 z-10 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-0 top-[calc(100%+10.5px)] z-10 overflow-hidden rounded-lg bg-white shadow-lg"
          >
            <div className="flex flex-col gap-21/2 p-21/2 md:flex-row md:p-0">
              {/* Options */}
              <div className="hidden h-full max-h-[428px] flex-col gap-21/2 overflow-y-auto text-nowrap px-21/2 py-1 md:flex">
                {getRangeOptions().map(option => (
                  <button
                    className={`trans-200 w-full rounded-lg px-2.5 py-1 text-left hover:bg-dark-100 hover:text-light ${option.label === selectedRangeOption ? 'bg-dark-100 text-light' : ''}`}
                    onClick={() => {
                      setRange(option.range)
                      setValue('from', option.range[0].startDate)
                      setValue('to', option.range[0].endDate)
                      setSelectedRangeOption(option.label)
                    }}
                    key={option.label}
                  >
                    <span className="text-xs font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>

              <button
                className="trans-200 rounded-md px-2 py-1.5 text-xs font-semibold shadow-md hover:bg-slate-100 md:hidden"
                onClick={() => setOpenOptions(!openOptions)}
              >
                {selectedRangeOption}
              </button>

              <AnimatePresence>
                {openOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute left-0 top-0 z-10 h-full w-full md:hidden"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    onClick={() => setOpenOptions(false)}
                  >
                    <div
                      className="absolute bottom-12 left-21/2 top-12 flex w-[calc(100%-21px)] flex-col gap-21/2 overflow-y-auto text-nowrap rounded-md border border-dark bg-slate-100 px-21/2 py-2.5 shadow-md md:flex"
                      onClick={e => e.stopPropagation()}
                    >
                      {getRangeOptions().map(option => (
                        <button
                          className={`trans-200 w-full rounded-lg px-2.5 py-1 text-left hover:bg-dark-100 hover:text-light ${option.label === selectedRangeOption ? 'bg-dark-100 text-light' : ''}`}
                          onClick={() => {
                            setRange(option.range)
                            setValue('from', option.range[0].startDate)
                            setValue('to', option.range[0].endDate)
                            setSelectedRangeOption(option.label)
                            setOpenOptions(false)
                          }}
                          key={option.label}
                        >
                          <span className="text-xs font-semibold">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Range */}
              <DateRange
                ranges={range}
                onChange={handleSelect}
                rangeColors={['#333']}
                months={monthsToShow}
                direction="horizontal"
                showMonthAndYearPickers={true}
                key={JSON.stringify(range)}
              />
            </div>
            <div className="flex justify-end gap-21/2 p-21/2 pt-0">
              <button
                disabled={false}
                className={`trans-200 group flex h-7 min-w-[48px] items-center justify-center rounded-lg border border-dark px-3 py-2 text-xs font-semibold text-dark hover:bg-slate-200 ${
                  false ? 'pointer-events-none bg-slate-200' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`trans-200 group flex h-7 min-w-[48px] items-center justify-center rounded-lg bg-dark-100 px-3 py-2 text-xs font-semibold text-white hover:bg-primary hover:text-dark ${
                  false ? 'pointer-events-none bg-slate-200' : ''
                }`}
                disabled={false}
                onClick={() => {
                  handleFilter()
                  setOpen(false)
                }}
              >
                {false ? (
                  <FaCircleNotch
                    size={18}
                    className="trans-200 animate-spin text-white group-hover:text-dark"
                  />
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default memo(DateRangeSelection)
