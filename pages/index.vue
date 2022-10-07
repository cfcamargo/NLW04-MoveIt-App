<template>
  <section class="flex flex-col lg:flex-row flex-1 lg:flex-none lg:mt-16 sm:gap-x-10 md:gap-x-20">
    <div class="flex flex-col w-full lg:w-1/2">
      <Profile />
      <CompletedChallenges />
      <Countdown @completed= "getNewChallenge"/>
      <button v-if="hasCountdownCompleted" disabled class="button completed">
        Completar Ciclo
      </button>
      <button v-else-if="isCountdownActive" class="button abandon" @click="setCountdownState(false)">
        Abanodar Ciclo
      </button>
      <button v-else class="button start" @click="setCountdownState(true)">
        Iniciar um Ciclo
      </button>
    </div>
    <Card class="w-full lg:w-1/2" id="challenge"/>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

import { mapState, mapMutations, mapGetters } from 'vuex'
import { Mutations as ChallengesMT } from '@/store/Challenges/types'
import { Mutations as CountdownMT } from '@/store/Countdown/types' 

import CompletedChallenges from '@/components/atoms/CompletedChallenges.vue'
import Profile from '@/components/molecules/Profile.vue'
import Countdown from '@/components/molecules/Countdown.vue'
import Card from '@/components/organisms/Card.vue'
import {
  playAudio,
  sendNotification,
  getRandonNumber,
  scrollToElement
} from '@/utils'

interface Head {
  title : string
}

export default Vue.extend({
  name: 'IndexPage',
  components: {
    CompletedChallenges,
    Profile,
    Countdown,
    Card
  },
  mounted() {
    if('Notification' in window){
      Notification.requestPermission();
    }
  },
  head (): Head {
    return {
      title: 'Home | move.it'
    }
  },
  computed: {
    ...mapState('Countdown',{
      hasCountdownCompleted: 'hasCompleted',
      isCountdownActive : 'isActive'
    }),
    ...mapGetters('Challenges', ['challengesLength'])
  },
  methods: {
    ...mapMutations({
      setCountdownHasCompleted: `Countdown/${CountdownMT.SET_HAS_COMPLETED}`,
      setCountdownHasActive: `Countdown/${CountdownMT.SET_IS_ACTIVE}`,
      setCurrentChallengeIndex: `Challenges/${ChallengesMT.SET_CURRENT_CHALLENGE_INDEX}`
    }),
    setCountdownState(flag : boolean){
      this.setCountdownHasCompleted(false),
      this.setCountdownHasActive(flag)
    },
    getNewChallenge (){
      const index = getRandonNumber(0, this.challengesLength);
      this.setCountdownHasCompleted(true);
      this.setCurrentChallengeIndex(index)

      if(Notification?.permission === 'granted') {
        playAudio('/notification.mp3');
        sendNotification( 'Novo Desafio!!', {
          body: 'Um novo desafio começou, Vamos completar',
          icon : '/favicon.png'
        })
      }

      this.$nextTick(()=> {
        scrollToElement('#challenge')
      })
    }
  }
})
</script>
