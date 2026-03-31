export interface ITodoItem {
  id: string
  text: string
  completed: boolean
}

export interface INote {
  id: string
  title: string
  todos: ITodoItem[]
  createdAt: number
  updatedAt: number
}
