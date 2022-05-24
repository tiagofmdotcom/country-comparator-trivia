<template>
    <Linebar id="line-chart" :chart-data="data" :chart-options="options" width="800px"/>
</template>

<script>
// lazy import (instead of tree shaking)
import {Line as Linebar} from 'vue-chartjs/legacy'

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
    name: 'LineChart',
    components: { Linebar },
    props: ['data', 'options'],
    computed: {
        chartOptions() {
            return {
                ...this.options,
                ... {
                    responsive: true,
                },
            }
        }
    },
}
</script>