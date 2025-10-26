/**
 * Vuex TypeScript declarations
 */

import { Store } from 'vuex'
import type { RootState } from '@/shared/api/store/types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}