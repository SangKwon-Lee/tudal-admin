export interface Tag {
  id: number
  name: string
}

export interface Stock {
  stockcode: number
  stockname: string
}

export interface Category {
  id: number
  name: string
}

export enum Priority {
  LOW = 1,
  MIDDLE = 3,
  HIGH = 5,
}
export interface Schedule {
  id: number
  title: string
  author: {
    id: number
    email: string
    username: string
    avatar: string
    blocked: boolean
    confirmed: boolean
    provider: string
    role: number
  }
  comment?: string
  priority: Priority
  categories?: Category[]
  keywords?: Tag[]
  stocks?: Stock[]
  startDate: Date
  endDate: Date
  publicDate: string
}

export interface IScheduleForm {
  title: string
  comment: string
  stockCodes: number[]
  author: string //id
  keywords: number[]
  categories: number[]
  priority: Priority
  startDate: string
  endDate: string
}
