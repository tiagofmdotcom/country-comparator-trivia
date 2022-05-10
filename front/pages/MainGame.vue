<template>
    <div>
        <div>
            <p v-if="$fetchState.pending">Fetching countries</p>
            <p v-else-if="$fetchState.error">An error occurred 😞</p>
            <div v-else>
                <Quiz
                    v-if="!gameFinished"
                    :game-mode="$route.params.gameMode"
                    @quiz:finished="showResults"
                />
            </div>
        </div>

        <CountrySelector v-if="false" :selected-countries="selectedCountries" />
        <EarthGlobe v-if="false" />

        <div v-if="gameFinished">
            <Report />
        </div>
    </div>
</template>

<script>
const fetchCountries = async (apiKey, fetchOffline) => {
    if(fetchOffline) {
        const cachedItems = { ...localStorage };
        return Object.keys(cachedItems).filter(k => k.startsWith('country-prices')).map(k => k.substr(15) );
    }

    const cachedCountries = localStorage.getItem('countries-list')
    if (cachedCountries) {
        return JSON.parse(cachedCountries)
    } else {
        const countries = await fetch(
            `http://www.numbeo.com:8008/api/country_prices?api_key=${apiKey}`
        ).then((res) => res.json());

        localStorage.setItem(
            'countries-list',
            JSON.stringify(countries.supported_countries)
        )
        return countries.supported_countries
    }
}

const fetchCountryPrices = async (apiKey, countryName) => {
    const cachedCountry = localStorage.getItem(`country-prices:${countryName}`)
    if (cachedCountry) {
        return JSON.parse(cachedCountry)
    } else {
        const country = await fetch(
            `http://www.numbeo.com:8008/api/country_prices?api_key=${apiKey}&country=${countryName}&currency=USD`
        ).then((res) => res.json());
        
        localStorage.setItem(
            `country-prices:${countryName}`,
            JSON.stringify(country)
        )
        return country
    }
}

export default {
    data: () => ({
        gameFinished: false,
        supportedCountries: [],
    }),

    async fetch() {
        const apiKey = this.$nuxt.context.$config.NUMBEO_API_KEY;
        this.supportedCountries = await fetchCountries(apiKey, this.$nuxt.context.$config.OFFLINE_MODE)

        // get 4 random countries
        const selectedCountries = await Promise.all(
            this.supportedCountries
                .map((name) => ({ name, order: Math.random() }))
                .sort((a, b) => a.order - b.order)
                .map((a) => a.name)
                .slice(0, 4)
                .map(async(countryName, index) => ({...await fetchCountryPrices(apiKey, countryName), ...{index}}) )
        )

        this.$store.commit('quiz/SET_COUNTRIES', selectedCountries)
    },

    methods: {
        showResults() {
            this.gameFinished = true
        },
    },
}
</script>
