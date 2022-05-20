<template>
    <main class="home">
        <ModalDialog
            v-show="showDialog"
            title="Select game mode"
        >
            <template #message>
                <p>Which game mode would you like to play?</p>
            </template>
            <template #footer>
                <button class="secondary" @click="startQuiz('SUSPENSE')">Suspense</button>
                <button @click="startQuiz('NORMAL')">Normal</button>
            </template>                
        </ModalDialog>

        <h1 class="welcome" data-testid="index-header">Welcome to Country Comparison Trivia!</h1>

        <div class="grid col-2">
            <div class="placement-center">
                <p>Prove that you are a conesseur on the fields of Geography, Demography and Economics.</p>
                <p>Four random countries will be selected and you will have to find the right answer for each question, are you ready?</p>
                <a href="#" class="btn" role="button" @click="chooseGameMode">Play now!</a>
            </div>

            <div>
                <img src="@/assets/images/earth-globe.png" />
            </div>
        </div>
        

    </main>
</template>

<script>
export default {
    name: 'HomePage',

    data: () => ({
        showDialog: false,
    }),

    methods: {
        chooseGameMode() {
            this.showDialog = true;
        },
        startQuiz(gameMode) {
            this.showDialog = false;
            this.$router.push({name: 'MainGame', params: { gameMode }})
        },
    },
}
</script>

<style lang="scss">
@import "@picocss/pico/scss/pico.scss";

    .home {
        height: 100vh;
        display: grid;
        place-content: center;
    }

    .col-2 {
        grid-template-columns: repeat(2, 1fr);
    }

    .welcome {
        font-size: clamp(1.5rem, 4vw, 46pt);
    }
</style>
