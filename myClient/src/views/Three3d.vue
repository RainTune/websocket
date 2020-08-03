<template>
  <div class="three3d" ref="three">
  </div>
</template>

<script>
import {Application} from './my3d';

export default {
  name: 'Three3d',
  mounted(){
    new Application('.three3d')
  },
}
</script>
<style lang="scss" scoped>
.three3d{}
</style>