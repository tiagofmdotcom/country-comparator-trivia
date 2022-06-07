<template>
    <div>
        <div style="text-align: center">
            <img
src="https://clipart.world/wp-content/uploads/2020/12/Simple-Trophy-clipart-transparent.png" width="150px"/>
            <p>You got</p>
            <p>{{correctAnswers.length || 0}}/10</p>
            <p>questions right!</p>
        </div>
        <h1>Game Stats</h1>
        <hr>
        <LineChart :data="countriesPricesChart" :options="options"/>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

import LineChart from '@/components/LineChart'

export default {
    name: 'GameReport',
    components: { LineChart },
    
    data: () => ({
  
    }),

    computed: {
        ...mapGetters({
            countriesFiltered: 'quiz/countriesFilterPricesPerCategory',
            priceCategories: 'quiz/priceCategories',
            correctAnswers: 'quiz/correctAnswers',
        }),

        countriesPricesChart() {
            const colors = ['#feb300', '#ba00ff', '#007900', '#ff4600']

            return {
                labels: this.priceCategories,
                datasets: Object.keys(this.countriesFiltered).map(
                    (country, idx) => ({
                        label: country,
                        tension: 0.1,
                        borderColor: colors[idx],
                        backgroundColor: colors[idx],
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                        data: this.priceCategories.map(
                            (pc) => this.countriesFiltered[country][pc]?.avg
                        ),
                    })
                ),
            }
        },    
    }
}
</script>
