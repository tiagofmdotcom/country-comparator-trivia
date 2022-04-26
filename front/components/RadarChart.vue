<script>
import { Radar } from 'vue-chartjs/legacy'

export default {
  extends: Radar,
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>