import {render, screen, fireEvent, waitFor} from '@testing-library/vue'
import Vue from 'vue'
import Vuex from 'vuex'
import * as quizStore from '@/store/quiz.js'
import Quiz from '@/components/Quiz.vue'

import countries from '@/helpers/countries_mock'

let store;

beforeEach (() => {
    Vue.use(Vuex);

    store = new Vuex.Store({
        modules: {
            quiz: {...quizStore, ...{namespaced: true}},
        }
    });
// console.log(store)
    store.commit('quiz/SET_COUNTRIES', countries)
});


test('Correct answer button should be green', async () => {
    
    render(Quiz,  {store, props: { gameMode: 'NORMAL', TESTING_MODE: true, amountOfQuestions: 2 }})

   
    // const nextQuestionBtn = screen.getByTestId('quiz-next-question');
    await waitFor(() => {
        expect(screen.getByTestId('quiz-correct-option')).toBeInTheDocument()
    })

    const correctButton = await screen.getByTestId('quiz-correct-option')

    await fireEvent.click(correctButton)

    expect(correctButton).toHaveClass('success')
})