import SummaryEmail from '@/components/emails/SummaryEmail'

export const summary = {
  collaborator: {
    _id: '65a8076a46110713ceda2b94',
    email: 'hothingoctram03@gmail.com',
    balance: 2222222,
    accumulated: 10067321,
    role: 'editor',
    avatar:
      'https://lh3.googleusercontent.com/a/ACg8ocKgTiu7wSX_TaEdFmfIQQNS39LMQHA90zgcKjDsgCkDdG7HfQw=s96-c',
    firstname: 'Trâm',
    lastname: 'Hồ Thị Ngọc',
    authType: 'google',
    authGoogleId: '108371762362393845253',
    authFacebookId: null,
    totalIncome: 0,
    createdAt: '2024-01-17T16:59:22.097Z',
    updatedAt: '2024-04-22T05:44:06.282Z',
    __v: 0,
    commission: { type: 'percentage', value: '10%' },
    verifiedEmail: true,
  },
  income: 5900,
  vouchers: [
    {
      _id: '662297de390b5fe4d7f094fb',
      code: 'HONGHUU',
      begin: '2024-04-19T00:00:00.000Z',
      expire: null,
      minTotal: 0,
      maxReduce: 10000,
      type: 'fixed-reduce',
      timesLeft: 0,
      value: '-10000',
      owner: '65a8076a46110713ceda2b94',
      usedUsers: [Array],
      active: true,
      accumulated: 5900,
      createdAt: '2024-04-19T16:12:14.957Z',
      updatedAt: '2024-04-19T16:19:15.091Z',
      __v: 0,
    },
  ],
}

function page() {
  return <SummaryEmail summary={summary} />
}

export default page
