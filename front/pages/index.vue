<template>
    <main class="container">
        <div>
            <head></head>
            <h1>Welcome to Country Comparison trivia</h1>
            <a href="#" class="btn" role="button" @click="chooseGameMode">Start</a>
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
