import type { ComputedRef } from 'vue'

import { computed, ref, unref } from 'vue'
import { useEventListener } from './useEventListener'
import { screenEnum, screenMap, sizeEnum } from '/@/enums/breakpointEnum'

let globalScreenRef: ComputedRef<sizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export interface CreateCallbackParams {
  screen: ComputedRef<sizeEnum | undefined>
  width: ComputedRef<number>
  realWidth: ComputedRef<number>
  screenEnum: typeof screenEnum
  screenMap: Map<sizeEnum, number>
  sizeEnum: typeof sizeEnum
}

export function useBreakpoint() {
  return {
    screenRef: computed(() => unref(globalScreenRef)),
    widthRef: globalWidthRef,
    screenEnum,
    realWidthRef: globalRealWidthRef,
  }
}

export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {
  const screenRef = ref<sizeEnum>(sizeEnum.XL)
  const realWidthRef = ref(window.innerWidth)

  function getWindowWidth() {
    const width = document.body.clientWidth
    const xs = screenMap.get(sizeEnum.XS)!
    const sm = screenMap.get(sizeEnum.SM)!
    const md = screenMap.get(sizeEnum.MD)!
    const lg = screenMap.get(sizeEnum.LG)!
    const xl = screenMap.get(sizeEnum.XL)!
    if (width < xs)
      screenRef.value = sizeEnum.XS
    else if (width < sm)
      screenRef.value = sizeEnum.SM
    else if (width < md)
      screenRef.value = sizeEnum.MD
    else if (width < lg)
      screenRef.value = sizeEnum.LG
    else if (width < xl)
      screenRef.value = sizeEnum.XL
    else
      screenRef.value = sizeEnum.XXL

    realWidthRef.value = width
  }

  useEventListener({
    el: window,
    name: 'resize',
    listener: () => {
      getWindowWidth()
      resizeFn()
    },
  })

  getWindowWidth()
  /* eslint-disable vue/no-ref-as-operand */
  globalScreenRef = computed(() => unref(screenRef))
  globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!)
  globalRealWidthRef = computed((): number => unref(realWidthRef))

  function resizeFn() {
    fn?.({
      screen: globalScreenRef,
      width: globalWidthRef,
      realWidth: globalRealWidthRef,
      screenEnum,
      sizeEnum,
      screenMap,
    })
  }

  resizeFn()
  return {
    screenEnum,
    screenRef: globalScreenRef,
    widthRef: globalWidthRef,
    realWidthRef: globalRealWidthRef,
  }
}
