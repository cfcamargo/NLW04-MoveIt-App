<template>
  <section class="flex flex-col flex-1 justify-center items-center py-5 px-10 md:px-16">
    <header class="w-full pb-6 border-p-2 border-background">
      <h2 class="text-xl text-blue font-semibold text-center">
        {{ `Ganhe ${amount} de xp`}}
      </h2>
    </header>
   

    <main class="flex flex-col flex-1 justify-center items-center ">
      <img :src="`icons/${type}.svg`" :alt="type" :style="{ minHeight: '70px' }"/>

      <h1 class="font-semibold text-3xl text-title mt-6 mb-2">Work out</h1>

      <p class="text-center text-base leading-6">
        {{ description }}
      </p>
    </main>

    <footer class="flex w-full gap-x-2 ">
      <button class="button failed" @click="resetChallenge">Falhei</button>
      <button class="button succeeded" @click="challengeSucceeded">Completado</button>
    </footer>

  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
 
import { Mutations as CountdownMT} from '@/store/Countdown/types'
import {
   Challenge as ChallengeType,
   Mutations as ChallengesMT
} from '@/store/Challenges/types'

export default Vue.extend<unknown, any, unknown, ChallengeType>({
  props: {
    type: { type: String, required: true},
    description : { type: String , required: true},
    amount : { type: Number, required: true}
  },
  computed : mapState('Challenges', ['level', 'xp', 'completedChallenges']),
  methods: {
    ...mapMutations({
      resetTime: `Countdown/${CountdownMT.RESET_TIME}`,
      setIsActive : `Countdown/${CountdownMT.SET_IS_ACTIVE}`,
      setHasCompleted : `Countdown/${CountdownMT.SET_HAS_COMPLETED}`,
      setCurrentChallengeIndex : `Challenges/${ChallengesMT.SET_CURRENT_CHALLENGE_INDEX}`,
      completeChallenge : `Challenges/${ChallengesMT.COMPLETE_CHALLENGE}`
    }),
    resetChallenge(){
      this.resetTime();
      this.setIsActive(false);
      this.setHasCompleted(false);
      this.setCurrentChallengeIndex(null);
    },
    challengeSucceeded(){
      this.resetChallenge();
      this.completeChallenge(this.amount);
      this.$cookiz.set('moveit',{
        level: this.level,
        xp: this.xp,
        completedChallenges : this.completedChallenges
      })
    }
  }
})

</script>
