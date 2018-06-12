<template>
  <div id="about">
    {{ project.about }}
  </div>
</template>

<script>
export default {
  name: "ProjectAboutBox",
  props: ['project'],
  data() {
    return { };
  }
}
</script>

<style scoped>
</style>
