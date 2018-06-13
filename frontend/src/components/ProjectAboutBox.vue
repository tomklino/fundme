<template>
  <div id="about">
    {{ project.about }}
    {{ this.$route.params.project_id }}
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
