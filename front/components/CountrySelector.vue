<template>
    <WorldMap ref="worldMap" class="world-map" />
</template>

<script>
import WorldMap from '~/assets/images/world-map.svg'
import countriesMapping from '~/helpers/countries_list.json'

export default {
    components: { WorldMap },

    props: {
        selectedCountries: {
            type: Array,
            required: true,
        },
    },

    data: () => ({
        currentCountry: null,
    }),

    created() {
        const countryCodes = Object.keys(countriesMapping)
        const totalCountries = countryCodes.length - 1

        const countryNames = this.selectedCountries.map((c) => c.name)
        // europe Object.fromEntries(x.map(_ => ([[Object.keys(y).find(key => y[key] === _)], _] ) ))

        const selectedCountriesCodes = Object.keys(countriesMapping)
            .filter((name) => {
                return countryNames.includes(countriesMapping[name])
            })
            .map((c) => c.toLowerCase())

        function delay(delayInms) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(2)
                }, delayInms)
            })
        }

        let counter = 0
        const repeaterId = setInterval(async () => {
            if (this.currentCountry)
                this.$refs.worldMap
                    ?.querySelector(`.${this.currentCountry}`)
                    ?.classList.remove('active')

            if (counter >= 40) {
                clearInterval(repeaterId)
            } else {
                counter++

                const randIndex = this.genRandomNumber(0, totalCountries)
                this.currentCountry = countryCodes[randIndex]?.toLowerCase()
                this.$refs.worldMap
                    ?.querySelector(`.${this.currentCountry}`)
                    ?.classList.add('active')

                const nth = counter / 10
                if (Number.isInteger(nth)) {
                    // eslint-disable-next-line nuxt/no-globals-in-created
                    window.console.log(counter)
                    this.$refs.worldMap
                        ?.querySelector(`.${selectedCountriesCodes[nth - 1]}`)
                        ?.classList.add('selected')
                }
            }

            await delay(100)
        }, 120)
    },

    methods: {
        genRandomNumber(mn, mx) {
            mn = Math.ceil(mn)
            mx = Math.floor(mx)
            return Math.floor(Math.random() * (mx - mn + 1) + mn)
        },
    },
}
</script>

<style lang="scss" scoped>
.world-map {
    max-width: 100%;

    #ocean {
        fill: transparent;
        stroke: transparent;
    }
    .coastxx,
    .landxx,
    .limitxx {
        fill: #49657b;
        stroke: #272e33;
        transition: 200ms all;
    }
}

.world-map .active,
.world-map .active * {
    fill: #36b2b2 !important;
}

.world-map .selected,
.world-map .selected * {
    fill: #14b16f !important;
}
</style>
