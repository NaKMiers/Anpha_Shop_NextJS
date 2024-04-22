import NotifyOrderEmail from '@/components/emails/NotifyOrderEmail'
import { order } from '../order/page'

function page() {
  return <NotifyOrderEmail order={order} />
}

export default page
