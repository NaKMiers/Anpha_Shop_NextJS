'use client'

import LoadingButton from '@/components/LoadingButton'
import { order, summary, updateInfoData } from '@/constansts/emailDataSamples'
import { useCallback, useState } from 'react'

const types = [
  {
    type: 'order',
    sample: { order },
  },
  {
    type: 'update-info',
    sample: { data: updateInfoData },
  },
  {
    type: 'reset-password',
    sample: { name: 'Ohara', link: 'https://anpha.shop' },
  },
  {
    type: 'verify-email',
    sample: { name: 'Naruto', link: 'https://anpha.shop' },
  },
  {
    type: 'notify-order',
    sample: { order },
  },
  {
    type: 'summary',
    sample: { summary },
  },
  {
    type: 'shortage-account',
    sample: { message: 'Thiếu tài khoản Netflix 100 năm' },
  },
]

function EmailPage() {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedSample, setSelectedSample] = useState<any>(null)

  const handleSentMail = useCallback(async (type: string) => {
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/test/email?type=${type}`)
      const data = await res.json()

      console.log('data: ', data.mailRes)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className='max-w-1200 mx-auto'>
      <div className='grid grid-cols-7 gap-21 cursor-pointer'>
        {types.map(type => (
          <div
            className='p-3 rounded-lg shaodow-lg bg-sky-50 flex flex-col items-center'
            key={type.type}
            onClick={() => setSelectedSample(type.sample)}>
            <h1 className='mb-2 font-semibold text-center text-dark'>{type.type}</h1>

            <LoadingButton
              className='w-20 px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
              onClick={() => handleSentMail(type.type)}
              text='Send'
              isLoading={loading}
            />
          </div>
        ))}
      </div>

      <div className='whitespace-pre bg-sky-50 min-h-[300px] rounded-lg shadow-lg p-21 mt-21 overflow-scroll'>
        <pre>{JSON.stringify(selectedSample, null, 2)}</pre>
      </div>
    </div>
  )
}

export default EmailPage
