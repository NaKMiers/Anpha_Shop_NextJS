import NotifyCommentEmail from '@/components/emails/NotifyCommentEmail'
import NotifyExpiredEmail from '@/components/emails/NotifyExpiredEmail'
import NotifyOrderEmail from '@/components/emails/NotifyOrderEmail'
import OrderEmail from '@/components/emails/OrderEmail'
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail'
import ShortageAccountEmail from '@/components/emails/ShortageAccountEmail'
import SummaryEmail from '@/components/emails/SummaryEmail'
import UpdateInfoEmail from '@/components/emails/UpdateInfoEmail'
import VerifyEmailEmail from '@/components/emails/VerifyEmailEmail'
import VerifyPhoneEmail from '@/components/emails/VerifyPhoneEmail'
import React from 'react'

function EmailTemplatePage({ params: { type } }: { params: { type: string } }) {
  console.log('type', type)

  const renderComponent = () => {
    switch (type) {
      case 'order':
        return <OrderEmail />
      case 'update-info':
        return <UpdateInfoEmail />
      case 'reset-password':
        return <ResetPasswordEmail />
      case 'verify-email':
        return <VerifyEmailEmail />
      case 'notify-order':
        return <NotifyOrderEmail />
      case 'summary':
        return <SummaryEmail />
      case 'shortage-account':
        return <ShortageAccountEmail />
      case 'notify-expired':
        return <NotifyExpiredEmail />
      case 'notify-comment':
        return <NotifyCommentEmail />
      case 'verify-phone':
        return <VerifyPhoneEmail />
      default:
        return null
    }
  }

  return renderComponent()
}

export default EmailTemplatePage
