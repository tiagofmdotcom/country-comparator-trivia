<template>
    <svg id="globe" ref="globe" width="400" height="400">
        <g>
            <path :d="pathString" />
        </g>
    </svg>
</template>

<script>
/* eslint-disable */

import * as d3 from 'd3'
import * as topojson from 'topojson-client'

export default {
    data: () => ({
        projection: null,
        geoGenerator: null,
        pathString: null,
        rotation: 0,

        speed: 0.01,
        verticalTilted: -10,
        horizontalTilted: 0,
    }),

    mounted() {
        const sens = 0.25
        const svg = d3.select('#globe')

        const g = d3.select('g')

        d3.json('world.json').then((json) => {
            console.log(json)
            const geoJson = topojson.feature(json, json.objects.countries)

            const countries = geoJson.features

            const projection = d3
                .geoOrthographic()
                .fitSize([400, 400], geoJson)
                // .rotate([this.rotation])
                .center([0, 0])
                // .clipAngle(90 )
                .rotate([this.rotation])

            const geoGenerator = d3.geoPath().projection(projection)
            this.pathString = geoGenerator(geoJson)

            window.requestAnimationFrame(() => {
                this.rotation = this.rotation + 0.2
            })

            console.log('yoooo')
            svg.call(
                d3
                    .drag()
                    .subject(function () {
                        var r = projection.rotate()
                        return { x: r[0] / sens, y: -r[1] / sens }
                    })
                    .on('drag', function (event) {
                        var rotate = projection.rotate()
                        projection.rotate([
                            event.x * sens,
                            -event.y * sens,
                            rotate[2],
                        ])
                        svg.selectAll('path').attr('d', geoGenerator(geoJson))
                        /*svg.selectAll('.focused').classed(
                            'focused',
                            (focused = false)
                        )*/
                    })
            ).call(d3.zoom().on('zoom', console.log('heyy')))

            window.requestAnimationFrame(() => {
                this.rotation = this.rotation + 0.2
            })

            /*const Rotate = () => {
                d3.timer((elapsed) => {
                    projection.rotate([
                        this.speed * elapsed - 120,
                        this.verticalTilted,
                        this.horizontalTilted,
                    ])
                    svg.selectAll('path').attr('d', geoGenerator(geoJson))
                })
            }
            Rotate()*/

            function country(cnt, sel) {
                for (var i = 0, l = cnt.length; i < l; i++) {
                    if (cnt[i].id == sel.value) {
                        return cnt[i]
                    }
                }
            }

            console.log(countries)
            let focused = null
            const goto = (id) => {
                var rotate = projection.rotate(),
                    focusedCountry = country(countries, { value: id }),
                    p = d3.geoCentroid(focusedCountry)

                svg.selectAll('.focused').classed('focused', (focused = false))

                //Globe rotating
                ;(function transition() {
                    d3.transition()
                        .duration(2500)
                        /*.tween("rotate", function() {
        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate([360]);
        };
      })   */
                        .tween('rotate', function () {
                            var r = d3.interpolate(projection.rotate(), [
                                -p[0],
                                -p[1],
                            ])
                            return function (t) {
                                projection.rotate(r(t))

                                svg.selectAll('path').attr(
                                    'd',
                                    geoGenerator(geoJson)
                                )
                                //.classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
                            }
                        })
                })()
            }

            window.goto = goto
        })
    },
}
</script>

<style>
#wrapper {
    width: 600px;
    margin: 20px auto;
}

path {
    fill: #aaa;
    stroke: #ddd;
    stroke-width: 0.5;
}
</style>
