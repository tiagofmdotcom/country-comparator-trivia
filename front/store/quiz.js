import Vue from 'vue'

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
