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
        <RadarChart :data="countriesPricesChart" :options="options"/>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

import RadarChart from '@/components/RadarChart'

export default {
    name: 'GameReport',
    components: { RadarChart },
    
    data: () => ({

        chartdata: {
            labels: [
                /*                 'Eating',
                'Drinking',
                'Sleeping',
                'Designing',
                'Coding',
                'Cycling',
                'Running', */
            ],
            datasets: [
                /* {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40],
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100],
                }, */
            ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            /* scales: {
                r: {
                    display: false
                }
            }, */
            elements: {
                point: {
                    radius: 1,
                },
                line: {
                    borderWidth: 1,
                },
            },
        },        
    }),

    computed: {
        ...mapGetters({
            countriesFiltered: 'quiz/countriesFilterPricesPerCategory',
            priceCategories: 'quiz/priceCategories',
            correctAnswers: 'quiz/correctAnswers',
        }),

        countriesPricesChart() {
            return {
                labels: this.priceCategories,
                datasets: Object.keys(this.countriesFiltered).map(
                    (country) => ({
                        label: country,
                        backgroundColor: `#${Math.floor(
                            Math.random() * 16777215
                        ).toString(16)}44`, // 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(179,181,198,1)',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                        data: this.priceCategories.map(
                            (pc) => this.countriesFiltered[country][pc].avg
                        ),
                    })
                ),
            }
        },    
    }
}
</script>
