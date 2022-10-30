import z from 'zod'

// createTaskSchema タスク作成時のスキーマ設定
export const createTaskSchema = z.object({
  title: z.string().max(20),
  body: z.string().min(5),
});
export type CreateTaskInput = z.TypeOf<typeof createTaskSchema>

// updateTaskSchema タスク編集時のスキーマ設定
export const updateTaskSchema = z.object({
  taskId: z.string().cuid(),
  title: z.string().max(20),
  body: z.string().min(5),
})
export type UpdateTaskInput = z.TypeOf<typeof updateTaskSchema>

// getSingleTaskSchema １つのタスク取得時のスキーマ設定
export const getSingleTaskSchema = z.object({
  taskId: z.string().cuid(),
})

// deleteTaskSchema タスク削除時のスキーマ設定
export const deleteTaskSchema = z.object({
  taskId: z.string().cuid()
})