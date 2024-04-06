export const handleQuery = (searchParams: { [key: string]: string[] } | undefined): string => {
  let query = '?'

  // remove empty value
  for (let key in searchParams) {
    if (!searchParams[key]) delete searchParams[key]
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

export const searchParamsToObject = (searchParams: URLSearchParams): { [key: string]: string[] } => {
  const params: { [key: string]: string[] } = {}
  for (let key of Array.from(searchParams.keys())) {
    params[key] = searchParams.getAll(key)
  }

  return params
}
