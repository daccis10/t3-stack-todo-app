import {
  createTaskSchema,
  updateTaskSchema,
  getSingleTaskSchema,
  deleteTaskSchema,
} from "../../../schema/todo";
import { t, authedProcedure } from '../trpc'

export const todoRouter = t.router({
  // タスク作成の関数
  createTask: authedProcedure.input(createTaskSchema).mutation(async ({ ctx, input }) => {
    const task = await ctx.prisma.task.create({
      data: {
        ...input,
        user: {
          connect: {
            id: ctx.session?.user?.id,
          }
        }
      }
    });
    return task
  }),
  // タスク取得の関数
  getTasks: t.procedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        userId: ctx.session?.user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  }),
  // １つのタスク取得の関数
  getSingleTasks: authedProcedure.input(getSingleTaskSchema).query(({ ctx, input }) => {
    return ctx.prisma.task.findUnique({
      where: {
        id: input.taskId,
      }
    })
  }),
  // タスク編集の関数
  updateTask: authedProcedure.input(updateTaskSchema).mutation(async ({ ctx, input }) => {
    const task = await ctx.prisma.task.update({
      where: {
        id: input.taskId,
      },
      data: {
        title: input.title,
        body: input.body,
      },
    });
    return task;
  }),
  // タスク削除の関数
  deleteTask: authedProcedure.input(deleteTaskSchema).mutation(async ({ ctx, input }) => {
    await ctx.prisma.task.delete({
      where: {
        id: input.taskId,
      }
    });
  }),
});