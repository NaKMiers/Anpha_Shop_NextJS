export const handleQuery = (
  searchParams: { [key: string]: string[] | string } | undefined,
  prefix: string = ''
): string => {
  let query = prefix + '?'

  // remove empty value
  for (let key in searchParams) {
    if (!searchParams[key]) delete searchParams[key]
  }

  // validate search params
  for (let key in searchParams) {
    // the params that allow only 1 value
    if (
      [
        'search',
        'sort',
        'userId',
        'voucherApplied',
        'status',
        'paymentMethod',
        'from',
        'to',
        'active',
        'usingUser',
        'expire',
        'renew',
        'role',
        'flashSale',
        'isFeatured',
        'type',
        'timesLeft',
        'beginFrom',
        'beginTo',
        'expireFrom',
        'expireTo',
        'timeType',
        'limit',
        'page',
      ].includes(key)
    ) {
      if (Array.isArray(searchParams[key]) && searchParams[key].length > 1) {
        searchParams[key] = searchParams[key].slice(-1)
      }
    }
  }

  // build query
  for (let key in searchParams) {
    // check if key is an array
    if (Array.isArray(searchParams[key])) {
      for (let value of searchParams[key]) {
        query += `${key}=${value}&`
      }
    } else {
      query += `${key}=${searchParams[key]}&`
    }
  }

  // remove all spaces
  query = query.replace(/ /g, '')

  // remove final '&'
  query = query.slice(0, -1)

  return query
}

// valid params
const validParams: string[] = [
  'from-to',
  'accumulated',
  'active',
  'address',
  'amount',
  'authType',
  'avatar',
  'balance',
  'begin',
  'beginFrom',
  'beginTo',
  'birthday',
  'booted',
  'category',
  'code',
  'color',
  'commission.type',
  'commission.value',
  'content',
  'costGroup',
  'date',
  'desc',
  'description',
  'discount',
  'displayName',
  'duration',
  'email',
  'expire',
  'expireFrom',
  'expireTo',
  'firstname',
  'flashSale',
  'from',
  'hide',
  'image',
  'images',
  'info',
  'isFeatured',
  'job',
  'lastname',
  'likes',
  'limit',
  'logo',
  'maxReduce',
  'minTotal',
  'notifiedExpire',
  'oldPrice',
  'owner',
  'page',
  'password',
  'paymentMethod',
  'phone',
  'price',
  'productId',
  'productQuantity',
  'quantity',
  'rating',
  'renew',
  'replied',
  'reviewAmount',
  'reviewDate',
  'role',
  'search',
  'slug',
  'sold',
  'sort',
  'status',
  'stock',
  'tags',
  'timeType',
  'times.days',
  'times.hours',
  'times.minutes',
  'times.seconds',
  'timesLeft',
  'title',
  'to',
  'total',
  'totalIncome',
  'type',
  'usedUsers',
  'userId',
  'username',
  'usingUser',
  'value',
  'verifiedEmail',
  'verifiedPhone',
  'voucherApplied',
]

export const searchParamsToObject = (searchParams: URLSearchParams): { [key: string]: string[] } => {
  // remove all invalid params
  for (let key of Array.from(searchParams.keys())) {
    if (!validParams.includes(key)) searchParams.delete(key)
  }

  const params: { [key: string]: string[] } = {}
  for (let key of Array.from(searchParams.keys())) {
    params[key] = searchParams.getAll(key)
  }

  return params
}
