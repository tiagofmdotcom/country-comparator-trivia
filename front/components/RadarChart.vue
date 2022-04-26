<template>
    <Radar :chart-data="data" :chart-options="options"/>
</template>

<script>
// lazy import (insteado of tree shaking)
import { Radar } from 'vue-chartjs/legacy'
/* import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Filler,
    CategoryScale,
    RadialLinearScale,
    RadarController,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, Filler, CategoryScale, RadialLinearScale,   RadarController) */

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


export default {
    name: 'BarChart',
    components: { Radar },
    props: ['data', 'options'],
}
</script>