<template>
  <base-modal-box>
    <div class="base-modal__content base-modal__text">
      {{ options.text }}
    </div>
  </base-modal-box>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  computed: {
    ...mapGetters({
      options: 'modals/getOptions'
    })
  }
})
</script>
