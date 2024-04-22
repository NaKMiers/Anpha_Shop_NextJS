import NotifyExpiredEmail from '@/components/emails/NotifyExpiredEmail'
import React from 'react'

export const expiredData = {
  _id: '6622afa213c9a6df523bac88',
  type: {
    _id: '6616c4a9cfdc10598ab611bb',
    title: 'AK2',
    slug: 'ak2',
  },
  info: '        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum quibusdam voluptate beatae aut in quia, illo accusantium fugiat eligendi nostrum aspernatur debitis suscipit ad quas ipsam nobis aliquid magni saepe similique quasi velit quo? Dignissimos molestias amet minus nesciunt id corrupti, dolorem ducimus quod nisi alias, accusantium, at nemo doloribus?',
  active: true,
  renew: '2024-06-20T00:00:00.000Z',
  times: {
    days: 100,
    hours: 0,
    minutes: 0,
    seconds: 0,
    _id: '66236a83faf0d2df956fc1f6',
  },
  createdAt: '2024-04-19T17:53:38.420Z',
  updatedAt: '2024-04-21T08:42:15.246Z',
  __v: 0,
  begin: '2024-04-20T07:10:14.022Z',
  expire: '2024-07-29T07:10:14.000Z',
  usingUser: 'oehaao@mailto.plus',
  title: 'AK2',
  remainingTime: '2 giờ',
  reBuyLink: 'http://localhost:3000/ak2',
}

function page() {
  return <NotifyExpiredEmail data={expiredData} />
}

export default page
