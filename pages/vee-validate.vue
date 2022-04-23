<template>
  <div class="example">
    <h1>
      {{ $t('i18n-example') }}
    </h1>
    <validation-observer
      v-slot="{ handleSubmit }"
      tag="div"
      class="swap"
    >
      <validation-provider
        v-slot="{ errors }"
        tag="div"
        name="Example field"
        :rules="`required`"
      >
        <input v-model="model.testValue" type="text">
        <div> {{ errors }}</div>
      </validation-provider>
      <button class="btn btn-primary" @click="handleSubmit(showTestModal)">
        submit
      </button>
    </validation-observer>
  </div>
</template>
<script lang="ts">

import MainVue from '~/mixins/MainVue'
import modals from '~/store/modals/modals'
import { IModalOptions } from '~/store/modals/state'

export default MainVue.extend({
  data: () => ({
    model: {
      testValue: '0'
    }
  }),
  methods: {
    showTestModal () {
      const payload: IModalOptions = {
        key: modals.default,
        title: 'Some title',
        text: 'Some text'
      }
      this.ShowModal(payload)
    }
  }
})

</script>
<style lang="scss" scoped>
.example {
  @include container;
}
</style>
