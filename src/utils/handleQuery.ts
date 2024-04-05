export const handleQuery = (searchParams: { [key: string]: string[] } | undefined): string => {
  let query = '?'

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

  // remove final '&'
  query = query.slice(0, -1)

  return query
}
