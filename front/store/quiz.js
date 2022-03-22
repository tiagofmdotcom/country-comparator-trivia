import Vue from 'vue'

/**
 * Extracts integer from given Object and Key, returning 0 if NaN
 * @param {Object} obj
 * @param {any} key
 * @param {any} prop=null
 * @returns {Number}
 */
const getInt = (obj, key, prop = null) => {
    if(prop === null)
        return obj[key] ?? 0;
    else
        return obj[key]?.[prop] ?? 0;
}

export const state = () => ({
    countries: [],
    questions: [],
    answers: [],
    choosenAnswers: [],
})

export const getters = {
    countries: (state) => {
        return state.countries
    },

    questions: (state) => {
        return state.questions
    },

    answers: (state) => {
        return state.answers
    },

    choosenAnswers: (state) => {
        return state.choosenAnswers
    },

    correctAnswers: (state) => {
        return state.choosenAnswers.filter(a => a.answer.isCorrect)
    },

    totalTime: (state) => {
        return state.choosenAnswers.reduce((total, curr) => {
            return total + curr.elapsedAnswerTime
        }, 0);
    },

    countryNames: (state) => {
        return state.countries.map(country => country.name)
    },

    priceCategories: (state) => {
        return  [...new Set( // a set is a fast way to make a distinct array
            state.countries[0]?.prices?.reduce((total, curr) => {
                const items = curr?.item_name?.split(',');
                        // item name (eg: Restaurants)
                return [...total, ...[items[items.length-1].trim()]]
            }, [])
        )];
    },
    
    countriesFilterPricesPerCategory: (state) => {
        return state.countries.reduce((countries, country) => {
            return {
                ...countries,
                ...{[country.name]: country.prices
                    .map(p => {
                        const items = p?.item_name?.split(',');
                                // item name (eg: Restaurants)
                        return {[items[items.length-1].trim()]: p?.average_price ?? 0}
                    })
                    .reduce((total, curr) => {
                        return {
                            ...total, 
                            ...{
                                // item name (eg: Restaurants) : calculate average
                                [Object.keys(curr)[0]]: {
                                    total: getInt(total, Object.keys(curr)[0], 'total') + getInt(curr, Object.keys(curr)[0]),
                                    count: getInt(total, Object.keys(curr)[0], 'count') + 1,
                                    get avg() { return this.total / this.count }
                                }
                            }
                        }
                    }, {})
                }
            }
        }, {})
    }
}

/* export const actions = {
    setCountries(state, values) {
        Vue.set(state, 'countries', values)
    },
} */

export const mutations = {
    SET_COUNTRIES(state, values) {
        Vue.set(state, 'countries', values)
    },

    SET_QUESTIONS(state, values) {
        Vue.set(state, 'questions', values)
    },

    SET_ANSWERS(state, values) {
        Vue.set(state, 'answers', values)
    },

    ADD_QUESTION_ANSWER(state, value) {
        state.choosenAnswers.push(value)
    },

    remove(state, { todo }) {
        state.list.splice(state.list.indexOf(todo), 1)
    },
    toggle(state, todo) {
        todo.done = !todo.done
    },
}
