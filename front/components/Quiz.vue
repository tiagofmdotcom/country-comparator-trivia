<!-- Please remove this file from your project -->
<template>
    <section class="quiz-container">
        <h1 v-if="countdownTimer" data-testid="quiz-countdown">
            Get ready! {{countdown}}
        </h1>

        <div v-else>
            <h2>{{ currentQuestion.question }}</h2>
            <div class="grid col-2" data-testid="quiz-options-answers">
                <button
                    v-for="(country, idx) in questionAnswers"
                    :key="idx"
                    :class="getClass(country)"
                    :data-testid="TESTING_MODE && country.isCorrect && 'quiz-correct-option' || null"
                    @click="!selectedAnswer && verifyAnswer(country)"
                >
                    {{ country.index + 1 }}. {{ country.name }}
                </button>
            </div>

            <div class="grid">
                <p>Elapsed time: {{ realTimeElapsed | msToMMSS  }}</p>
            </div>

            <div :class="['answer-reaction', answerReactionClass]"></div>

            <div v-if="TESTING_MODE">
                <button class="primary" :disabled="!selectedAnswer" data-testid="quiz-next-question" @click="gotoNextQuestion">
                    <!-- eslint-disable-next-line -->
                    {{ ((questionIndex + 1) < selectedQuestions.length) ? 'Next >' : 'Finish'}}
                </button>
            </div>

            <progress
                class="quiz-progress"
                :value="questionIndex + 1"
                :max="selectedQuestions.length"
            ></progress>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import questions from '@/helpers/questions'

export default {
    name: 'QuizUI',

    filters: {
        msToMMSS(ms) {
            const minutes = Math.floor(ms / 60000);
            const seconds = ((ms % 60000) / 1000).toFixed(0);
            return   seconds === 60 
                ? (minutes + 1) + ":00"
                : (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        }
    },

    props: {
        gameMode: {
            type: String,
            validator: (val) => {
                return ['SUSPENSE', 'NORMAL'].includes(val);
            },
            default: 'NORMAL'
        },

        amountOfQuestions: {
            type: Number,
            default: 10,
        },

        // eslint-disable-next-line vue/prop-name-casing
        TESTING_MODE: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        questionIndex: null,
        currentQuestion: {},
        comparationItems: [],
        answerReactionClass: '', // FIXME : USE COMPUTED

        timer: {
            start: 0,
            end: 0,
            ref: null,
            tick: 0
        },

        countdown: 5,
        countdownTimer: null,
    }),

    computed: {
        ...mapGetters({
            selectedCountries: 'quiz/countries',
            selectedQuestions: 'quiz/questions',
            questionAnswers: 'quiz/answers',
            choosenAnswers: 'quiz/choosenAnswers',
        }),

        correctAnswer() {
            return this.questionAnswers.filter((a) => a.isCorrect)
        },

        selectedAnswer() {
            return this.choosenAnswers.find(
                (a) => a.questionId === this.currentQuestion.id
            )?.answer
        },

        timerElapsedTime() {
            if(!this.timer.start || !this.timer.end) return 0;
            return this.timer.end - this.timer.start;
        },

        realTimeElapsed() {
            if(!this.timer.start) return 0;
            return this.timer.tick === 0 ? 0 : this.timer.tick - this.timer.start; // ternary to avoid overflow
        },
    },

    watch: {
        questionIndex(newIdx) {
            if (newIdx >= this.selectedQuestions.length) {
                this.stopTimer();
                this.$emit('quiz:finished');
                return (this.questionIndex = this.selectedQuestions.length - 1);
            }

            this.answerReactionClass = '';

            this.setAnswers(newIdx);
        },
    },


    created() {
        this.comparationItems = this.selectedCountries[0]?.prices.map((p) => ({
            id: p.item_id,
            name: p.item_name,
        }))
        this.generateQuestions(this.amountOfQuestions)
    },

    mounted() {
        if(!this.TESTING_MODE) {
            this.countdownTimer = setInterval(() => (this.countdown -= 1), 1000);
            setTimeout(this.startQuiz, 6000);
        } else {
            this.startQuiz();
        }
    },

    methods: {
        startQuiz() {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
            this.countdown = 5;

            this.questionIndex = 0;
        },

        getClass(country) {
            if (
                this.selectedAnswer &&
                Number.isInteger(this.selectedAnswer.index)
            ) {
                if(this.selectedAnswer?.index === country.index && this.gameMode === 'SUSPENSE') return 'primary'; // SUSPENSE game mode doesnt reveal correct/incorrect answers

                // if user selected an answer
                if (
                    this.selectedAnswer?.index === country.index && 
                    this.gameMode === 'NORMAL'
                ) {
                    // and this button matches the selected answer
                    if (this.selectedAnswer.isCorrect) {
                        // use .success if correct, or .error otherwise
                        return 'success'
                    } else {
                        return 'error'
                    }

                    // and this button matches the actual correct answer, use .success
                } else if (
                    this.selectedAnswer?.index !== country.index &&
                    country.isCorrect &&
                    this.gameMode === 'NORMAL'
                ) {
                    return 'success'
                }
            }
            // no answer yet or not the correct answer
            return 'secondary'
        },

        verifyAnswer(answer) {
            this.stopTimer();
            const choosenAnswer = {
                answer,
                questionId: this.currentQuestion.id,
                elapsedAnswerTime: this.timerElapsedTime
            }

            this.$store.commit('quiz/ADD_QUESTION_ANSWER', choosenAnswer)

            this.answerReactionClass = this.gameMode === 'NORMAL' && (answer.isCorrect ? 'correct' : 'incorrect')
            // TODO: Perform some sort of suspense animation to hightlight correct/wrong answers

            if(!this.TESTING_MODE) {
                setTimeout(() => {
                    this.gotoNextQuestion();
                }, 1500)
            }
        },

        setAnswers(questionIndex) {
            const currentQuestion = this.selectedQuestions[questionIndex];
            if(!currentQuestion) {
                window.console.error(`Invalid question index (${questionIndex})`);
                return false;
            }

            this.currentQuestion = Object.assign(
                {},
                this.currentQuestion,
                currentQuestion
            )

            let targetValue = null
            const questionAnswers = this.selectedCountries.map((c) => {
                const currValue = c.prices.find(
                    (p) => p.item_id === currentQuestion.id
                )?.average_price; // [1] some items might not have data

                currValue === null || currValue === undefined && console.info(`${c.name} is missing data for question "${currentQuestion.question}"`)

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
                        return currValue !== null && currValue !== undefined && this.value === targetValue // [2] and if it doesnt have data, will be automatically not the correct option
                    },
                }
            })

            this.$store.commit('quiz/SET_ANSWERS', questionAnswers);

            this.startTimer();
        },

        getQuestion(itemId) {
            const questionItem = questions[itemId]
            // eslint-disable-next-line no-unused-vars
            const randomIdx = this.genRandomIndex(questionItem.length)
            return questionItem[randomIdx]
        },


        generateQuestions(amount) {
            const selectedQuestions = this.comparationItems
                .map((x) => ({ x, r: Math.random() }))
                .sort((a, b) => a.r - b.r)
                .map((a) => a.x)
                .slice(0, amount)
                .map((q) => {
                    const isMost = !!this.genRandomNumber(0, 1); // random value rule (highest or lowest)
                    const questionTxt = `Which country has the ${
                        isMost ? 'most expensive' : 'cheapest'
                    } %item_name%?`
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

        genRandomIndex(length) {
            return this.genRandomNumber(0, length - 1)
        },

        genRandomNumber(mn, mx) {
            mn = Math.ceil(mn)
            mx = Math.floor(mx)
            return Math.floor(Math.random() * (mx - mn + 1) + mn)
        },

        startTimer() {
            this.timer.start = new Date().getTime();
            this.timer.end = 0;
            this.timer.tick = 0;

            this.timer.ref = setInterval(() => (this.timer.tick = new Date().getTime()), 900)
        },

        stopTimer() {
            if(this.timer.start === 0) return; // the timer is not running
            this.timer.end = new Date().getTime();
            clearInterval(this.timer.ref);
        },

        gotoNextQuestion() {
            this.questionIndex++;
        }
    },
}
</script>

<style scoped>
.quiz-container {
    width: 100%;
}

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

.success {
    background-color: #80c600;
}

.answer-reaction {
    position: fixed;
    transform: translate(-50%,-50%);
    left: 50%;
    font-size: 2rem;
    height: 60px;
    bottom: -100px;
    transition: 1s all;
}

.answer-reaction.correct,
.answer-reaction.incorrect {
    animation: pop 2s ;
}

.answer-reaction.correct::before {
    content: '🤩';
}

.answer-reaction.incorrect::before {
    content: '😢';
}

@keyframes pop {
    0% { transform: translate(-50%,-50%) rotate(0) scale(0);}
    33% { transform: translate(-50%,-50%) rotate(20deg) scale(2.5); }
    66% { transform: translate(-50%,-50%) rotate(-20deg) scale(2.5); }

    100% {
        transform: translate(-50%,-50%) rotate(0) scale(0);
        bottom: 50%;
    }
}

</style>
