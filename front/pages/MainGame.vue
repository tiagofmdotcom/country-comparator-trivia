<template>
    <div>
        <Quiz
            v-if="!gameFinished"
            :game-mode="$route.params.gameMode"
            @quiz:finished="showResults"
        />

        <CountrySelector v-if="false" :selected-countries="selectedCountries" />
        <EarthGlobe v-if="false" />

        <div v-if="gameFinished">
            <Report />
        </div>
    </div>
</template>

<script>
import countries from '@/helpers/countries'

export default {
    data: () => ({
        selectedCountries: [],
        selectedCountriesISO3166: [],
        gameFinished: false,

    }),


    created() {
        // get 4 random countries
        const selectedCountries = Object.values(countries)
            .map((x) => ({ x, r: Math.random() }))
            .sort((a, b) => a.r - b.r)
            .map((a) => a.x)
            .slice(0, 4)
            .map((q, index) => ({ ...q, ...{ index } }))

        this.$store.commit('quiz/SET_COUNTRIES', selectedCountries)
    },

    methods: {
        showResults() {
            this.gameFinished = true
        },
    },
}
</script>
