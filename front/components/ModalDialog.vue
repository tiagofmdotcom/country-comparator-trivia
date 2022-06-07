<template>
    <dialog class="dialog" open>
        <article>
            <h3>{{ title }}</h3>
            <slot name="message">
                <p>{{ message }}</p>
            </slot>
            <footer>
                <slot name="footer">
                    <a
                        href="#cancel"
                        role="button"
                        class="secondary"
                        @click="$emit('reject', $event)"
                    >
                        Cancel
                    </a>
                    <a
                        href="#confirm"
                        role="button"
                        @click="$emit('accept', $event)"
                    >
                        Confirm
                    </a>
                </slot>
            </footer>
        </article>
    </dialog>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            required: true,
        },
    },

    methods: {

    },
}
</script>

<style scoped lang="scss">
.dialog {

    & > article {
        width: 100%;
    }

    & footer {
        display: grid;
        column-gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
        
        & > button {
            margin: 0;
        }
    }

}
</style>
