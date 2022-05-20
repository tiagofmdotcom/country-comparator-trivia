<template>
    <div class="wrapper placement-center">
        <Nuxt class="container"/>
    </div>
</template>
<script>
export default {
    name: 'DefaultLayout',
}
</script>

<style lang="scss">
@import "@picocss/pico/scss/pico.scss";
.wrapper {
    background-image: linear-gradient(-15deg, rgba(17,25,31,0.9) 50%, rgba(17,25,31,0.4) 100%), url(@/assets/images/bg.jpg);
    background-color: #82d5fd;
    background-size: 100% auto;
    background-position-y: bottom;
    height: 100vh;
}


.placement-center {
    display: grid;
    place-content: center;
}
</style>
