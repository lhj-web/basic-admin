import type { ContextMenuItem } from '@/components/ContextMenu'
import { getCurrentInstance, onUnmounted } from 'vue'
import { createContextMenu, destroyContextMenu } from '@/components/ContextMenu'
export type { ContextMenuItem }
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu()
    })
  }
  return [createContextMenu, destroyContextMenu]
}
