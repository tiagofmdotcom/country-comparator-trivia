<!-- Please remove this file from your project -->
<template>
    <section>
        <h2>{{ currentQuestion.question }}</h2>
        <div class="grid col-2">
            <button
                v-for="(country, idx) in questionAnswers"
                :key="idx"
                :class="getClass(country)"
                @click="!selectedAnswer && verifyAnswer(country)"
            >
                {{ country.index + 1 }}. {{ country.name }}
            </button>
        </div>

        <progress
            class="quiz-progress"
            :value="questionIndex + 1"
            :max="selectedQuestions.length"
        ></progress>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import questions from '@/helpers/questions'

export default {
    name: 'NuxtTutorial',

    data: () => ({
        questionIndex: null,
        currentQuestion: {},
        comparationItems: [],
    }),

    computed: {
        ...mapGetters({
            selectedCountries: 'quiz/countries',
            selectedQuestions: 'quiz/questions',
            questionAnswers: 'quiz/answers',
            choosenAnswers: 'quiz/choosenAnswers',
        }),

        correctAnswer() {
            return this.questionAnswers.find((a) => a.isCorrect)
        },

        selectedAnswer() {
            return this.choosenAnswers.find(
                (a) => a.questionId === this.currentQuestion.id
            )?.answer
        },
    },

    watch: {
        questionIndex(newIdx) {
            if (newIdx >= this.selectedQuestions.length)
                return (this.questionIndex = this.selectedQuestions.length - 1)

            const currentQuestion = this.selectedQuestions[newIdx]
            this.currentQuestion = Object.assign(
                {},
                this.currentQuestion,
                currentQuestion
            )

            let targetValue = null
            const questionAnswers = this.selectedCountries.map((c) => {
                const currValue = c.prices.find(
                    (p) => p.item_id === currentQuestion.id
                ).average_price
                targetValue = currentQuestion.answerMostExpensive // are we looking for the highest or the lowest?
                    ? currValue > targetValue
                        ? currValue
                        : targetValue // if higher than current highest, sets new value
                    : currValue < targetValue || targetValue === null
                    ? currValue
                    : targetValue // if lower than current highest, sets new value

                return {
                    index: c.index,
                    name: c.name,
                    value: currValue,
                    get isCorrect() {
                        return this.value === targetValue
                    },
                }
            })

            this.$store.commit('quiz/SET_ANSWERS', questionAnswers)
        },
    },

    created() {
        this.comparationItems = this.selectedCountries[0]?.prices.map((p) => ({
            id: p.item_id,
            name: p.item_name,
        }))
        this.generateQuestions()
        this.questionIndex = 0
    },

    methods: {
        getClass(country) {
            if (
                this.selectedAnswer &&
                Number.isInteger(this.selectedAnswer.index)
            ) {
                // if user selected an answer
                if (this.selectedAnswer?.index === country.index) {
                    // and this button matches the selected answer
                    if (this.selectedAnswer.isCorrect) {
                        // use .primary if correct, or .error otherwise
                        return 'primary'
                    } else {
                        return 'error'
                    }

                    // and this button matches the actual correct answer, use .primary
                } else if (
                    this.selectedAnswer?.index !== country.index &&
                    country.isCorrect
                ) {
                    return 'primary'
                }
            }

            // no answer yet or not the correct answer
            return 'secondary'
        },

        verifyAnswer(answer) {
            const choosenAnswer = {
                answer,
                questionId: this.currentQuestion.id,
            }

            this.$store.commit('quiz/ADD_QUESTION_ANSWER', choosenAnswer)

            // TODO: Perform some sort of suspense animation to hightlight correct/wrong answers

            setTimeout(() => {
                this.questionIndex++
            }, 1500)
        },

        getQuestion(itemId) {
            const questionItem = questions[itemId]
            // eslint-disable-next-line no-unused-vars
            const randomIdx = this.genRandomIndex(questionItem.length)
            return questionItem[randomIdx]
        },

        genRandomIndex(length) {
            return this.genRandomNumber(0, length - 1)
        },

        genRandomNumber(mn, mx) {
            mn = Math.ceil(mn)
            mx = Math.floor(mx)
            return Math.floor(Math.random() * (mx - mn + 1) + mn)
        },

        generateQuestions() {
            const selectedQuestions = this.comparationItems
                .map((x) => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map((a) => a.x)
                .slice(0, 10)
                .map((q) => {
                    const isMost = !!this.genRandomNumber(0, 1)
                    const questionTxt = `Country with the ${
                        isMost ? 'most' : 'least'
                    } expensive %item_name%?`
                    const itemNames = q.name.split(',')
                    return {
                        ...q,
                        ...{
                            question: questionTxt.replace(
                                '%item_name%',
                                itemNames.slice(0, itemNames.length - 1)
                            ),
                            answerMostExpensive: isMost,
                        },
                    }
                })

            this.$store.commit('quiz/SET_QUESTIONS', selectedQuestions)
        },
    },
}
</script>

<style scoped>
.col-2 {
    grid-template-columns: repeat(2, 1fr);
}

.quiz-progress {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    border-radius: 0;
    height: 0.75rem;
}

.error {
    background-color: var(--del-color);
}
</style>
