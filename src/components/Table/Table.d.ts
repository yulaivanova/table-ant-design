export type AlignType = 'right' | 'left' | 'center' | undefined

export interface DataType {
  key: React.Key
  name: string
  age: number
  id: number
  desc: string
}

export interface TableHeadsType {
  caption: string
  key: string
}
