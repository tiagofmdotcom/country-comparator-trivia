<template>
    <div>
        <Tutorial v-if="true" :selected-countries="selectedCountries" />
        <CountrySelector v-if="false" :selected-countries="selectedCountries" />
        <EarthGlobe v-if="false" />
    </div>
</template>

<script>
import countries from '@/helpers/countries'

export default {
    name: 'IndexPage',

    data: () => ({
        selectedCountries: [],
        selectedCountriesISO3166: [],
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
}
</script>
