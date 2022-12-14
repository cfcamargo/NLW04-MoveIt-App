import { Mutations } from '@/store/Challenges/types'

export const actions = {
  nuxtServerInit ({ commit } : any, { app }: any) {
    const cookie = app.$cookiz.get('moveit')

    if(cookie){
      commit(`Challenges/${Mutations.SAVE_COOKIE_DATA}`, cookie);
    }
  }
}