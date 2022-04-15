const MAX_AGE_IN_DAYS = 3

class CachePolicy {
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static validate(timestamp: Date, date: Date): boolean {
    const maxAge = new Date(timestamp)
    maxAge.setDate(maxAge.getDate() + MAX_AGE_IN_DAYS)

    return maxAge > date
  }
}

export {CachePolicy}
