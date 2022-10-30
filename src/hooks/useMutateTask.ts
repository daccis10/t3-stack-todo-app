import useStore from "../store"
import { trpc } from "../utils/trpc"

export const useMutateTask = () => {
  // utils 裏で使用しているreact-queryのキャッシュ更新に使用する
  const utils = trpc.useContext()
  // 関数定義
  const reset = useStore((state) => state.resetEditedTask);
  const createTaskMutation = trpc.todo.createTask.useMutation({
    onSuccess: (res) => {
      // previosTodos 現在のキャッシュデータを取得
      const previosTodos = utils.todo.getTasks.getData();
      if (previosTodos) {
        // setData キャッシュデータの更新
        utils.todo.getTasks.setData([res, ...previosTodos])
      }
      // reset TodoStateのリセット
      reset();
    }
  })
  const updateTaskMutation = trpc.todo.updateTask.useMutation({
    onSuccess: (res) => {
      // previosTodos 現在のキャッシュデータを取得
      const previosTodos = utils.todo.getTasks.getData()
      if (previosTodos) {
        // setData キャッシュデータの更新
        utils.todo.getTasks.setData(
          previosTodos.map((task) => (task.id === res.id ? res : task))
        )
      }
      // reset TodoStateのリセット
      reset()
    }
  })
  const deleteTaskMutation = trpc.todo.deleteTask.useMutation({
    // variables inputのデータを受け取る
    onSuccess: (_, variables) => {
      // previosTodos 現在のキャッシュデータを取得
      const previosTodos = utils.todo.getTasks.getData()
      if (previosTodos) {
        // setData キャッシュデータの更新
        utils.todo.getTasks.setData(
          previosTodos.filter((task) => task.id !== variables.taskId)
        )
      }
      // reset TodoStateのリセット
      reset()
    }
  })

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  }
}
