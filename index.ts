import { objectMeetsCriteria, objectMerge } from '@aeq/obj'
type DTO = { [key: string]: any }

type Criteria = DTO | Function

export default function toggle<T> (array: T[], item: T): T[] {
  var itemIndex = array.indexOf(item)
  if (itemIndex === -1) {
    array.push(item)
    return array
  }
  array.splice(itemIndex, 1)
  return array
}

export function arrayToggleByCriteria<T> (array: T[], criteria: DTO | Function, item: T): T[] {
  const existingItem = arrayFindByCriteria(array, criteria)
  return existingItem ? arrayRemove(array, existingItem)
    : [...array, item]
}

export function arraySpliceOrNewByCriteria<T> (array: T[], criteria: DTO | Function, item: T) {
  const index = arrayFindIndexByCriteria(array, criteria)

  if (index >= 0) {
    array.splice(index, 1, item)
    return
  }
  array.splice(0, 0, item)
}

export function arrayFillOrNewByCriteria<T> (array: T[], criteria: DTO | Function, item: T) {
  const index = arrayFindIndexByCriteria(array, criteria)

  if (index >= 0) {
    objectMerge(array[index], item)
    return
  }
  array.splice(0, 0, item)
}

/**
 * Find item by criteria.
 */
export function arrayFindByCriteria<T> (array: T[], criteria: Criteria): T | null {
  return array.find(
    item => {
      return typeof criteria === 'function'
        ? criteria(item)
        : objectMeetsCriteria(item, criteria)
    }
  ) || null
}

/**
 * Find item by criteria.
 */
export function arrayFindIndexByCriteria (array: any[], criteria: Criteria): number {
  return array.findIndex(
    item => {
      return typeof criteria === 'function'
        ? criteria(item)
        : objectMeetsCriteria(item, criteria)
    }
  )
}

export function arrayLast<T> (array: T[]): T | null {
  if (!array.length) {
    return null
  }
  return array[array.length - 1]
}

/**
 * Array meets criteria.
 */
export function arrayMeetsCriteria (array: any, criteria: Criteria) {
  return !!arrayFindByCriteria(array, criteria)
}

/**
 * Remove item from array via identity check.
 */
export function arrayRemove<T> (array: T[], item: T): T[] {
  const result = array
  const foundItemIndex = array.indexOf(item)
  if (foundItemIndex !== -1) {
    result.splice(foundItemIndex, 1)
  }

  return result
}

/**
 * Remove item from array via criteria check.
 */
export function arrayRemoveByCriteria<T> (array: T[], criteria: DTO | Function, item?: T): T[] {
  const existingItem = arrayFindByCriteria(array, criteria)
  if (existingItem) {
    return arrayRemove(array, existingItem)
  }
  return array
}

export function arraySortMove<T> (array: T[], from: number, to: number): T[] {
  const el = array[from]
  array.splice(from, 1)
  array.splice(to, 0, el)
  return array
}

/**
 * Group array into a set of arrays based on condition.
 * Condition should return a string.
 */
export function arrayGroupByCondition<T> (array: T[], condition: (t: T) => string): { [key: string]: T[] } {
  const groups: { [key: string]: T[] } = {}
  array.forEach(item => {
    const result = condition(item)
    if (!groups[result]) {
      groups[result] = []
    }
    groups[result].push(item)
  })
  return groups
}

export function arrayUnique<T> (array: T[]): T[] {
  return array.filter((value, index, self) => {
    return self.indexOf(value) === index
  })
}

export function arrayUniqueByKeys<T> (array: T[], keys: string[]): T[] {
  return array.filter((value, index, self) => {
    const criteria: DTO = {}
    keys.forEach(key => {
      criteria[key] = (value as any)[key]
    })
    return arrayFindIndexByCriteria(array, criteria) === index
  })
}
