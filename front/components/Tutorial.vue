<!-- Please remove this file from your project -->
<template>
    <section>
        <h2>{{currentQuestion.question}}</h2>
        <div class="grid col-2">
            <button v-for="(country, idx) in selectedCountries" :key="idx" class="secondary" @click="verifyAnswer($event, country)">
                {{ country.name }}
            </button>
        </div>

        <progress class="quiz-progress" :value="questionIndex+1" :max="selectedQuestions.length"></progress>
    </section>
</template>

<script>
import questions from '@/helpers/questions';
import countries from '@/helpers/countries';

export default {
    name: 'NuxtTutorial',

    data: () => ({
        questionIndex: null,
        currentQuestion: {},
        comparationItems: [],
        selectedQuestions: [],
        selectedCountries: [],
        correctPrice: {},
        selectedAnswer: null,
        isQuestionAnswered: false,
    }),

    watch: {
        questionIndex(newIdx) {
            if(newIdx >= this.selectedQuestions.length) return (this.questionIndex = this.selectedQuestions.length-1);

            const currentQuestion = this.selectedQuestions[newIdx] // this.getQuestion(newIdx);
            this.currentQuestion = Object.assign({}, this.currentQuestion, currentQuestion);

            const prices = this.selectedCountries.map(c => c.prices.find(p => p.item_id === currentQuestion.id).average_price);
            this.correctPrice = currentQuestion.answerMostExpensive ? Math.max(...prices) : Math.min(...prices);

        }
    },

    created() {
        this.selectedCountries = [...countries];
        this.comparationItems = countries[0].prices.map((p) => ({id: p.item_id, name: p.item_name}));
        this.generateQuestions();
        this.questionIndex  = 0;

    },

    methods: {
        verifyAnswer($event, answer) {
            if(this.isQuestionAnswered) return;


            this.selectedAnswer = answer.city_id;
            if(answer.prices.find(p => p.item_id === this.currentQuestion.id).average_price === this.correctPrice) {
                console.log(`Right answer!`)
                console.log($event.target)
                $event.target.classList.remove('secondary')
                $event.target.classList.toggle('primary')

            } else {
                console.log(`Wrong answer!`)
                $event.target.classList.remove('secondary')
                $event.target.classList.toggle('error')
                this.isQuestionAnswered = false;
            }
            setTimeout(() => {this.questionIndex++; this.selectedAnswer = null; this.isQuestionAnswered = false; $event.target.classList = ['secondary']}, 1500);
            this.isQuestionAnswered = true;
        },

        getQuestion(itemId) {
            const questionItem = questions[itemId]; 
            // eslint-disable-next-line no-unused-vars
            const randomIdx = this.genRandomIndex(questionItem.length);
            return questionItem[randomIdx];
        },

        genRandomIndex(length) {
            return this.genRandomNumber(0, length - 1);
        },

        genRandomNumber(mn, mx) {
            mn = Math.ceil(mn);
            mx = Math.floor(mx);
            return Math.floor(Math.random() * (mx - mn + 1) + mn);
        },

        generateQuestions() {
            const selectedQuestions = 
                this.comparationItems.map(x => ({ x, r: Math.random() }))
                                    .sort((a, b) => a.r - b.r)
                                    .map(a => a.x)
                                    .slice(0, 10)
                                    .map(q => {
                                        const isMost = !!this.genRandomNumber(0,1);
                                        const questionTxt = `Country with the ${isMost ? 'most' : 'least'} expensive %item_name%?`;
                                        const itemNames = q.name.split(',');
                                        return {
                                            ...q,
                                            ...{
                                                question: questionTxt.replace('%item_name%', itemNames.slice(0,itemNames.length-1)),
                                                answerMostExpensive: isMost
                                            }
                                        }
                                    });

            this.selectedQuestions = Object.assign([], this.currentQuestion, selectedQuestions);
        }
    }
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