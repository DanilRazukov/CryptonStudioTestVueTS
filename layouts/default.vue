<template>
  <div class="primary">
    <div class="primary__template template">
      <div class="template__content">
        <nuxt />
      </div>
    </div>
    <base-modal-container />
    <loader-screen />
  </div>
</template>
<script lang="ts">
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  mounted () {
    this.SetLoader(true)
    setTimeout(() => {
      this.SetLoader(false)
    }, 1000)
  }
})
</script>
<style lang="scss" scoped>
.primary {
  height: 100vh;
  overflow-y: auto;
  &__template {
    height: 100%;
    display: grid;
    grid-template-rows: 100px 1fr auto;
  }
}
.template {
  height: 100%;
  min-height: 100vh;
  overflow: auto;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
}
</style>
