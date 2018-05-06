<style scoped>
    .loading-wrapper{
        text-align: center;
    }
</style>

<template>
    <div v-if="isLoading" class="loading-wrapper">
        <ons-progress-circular indeterminate></ons-progress-circular>
    </div>
</template>

<script>
    export default {
        name: 'loading-indicator',
        props: {
            isLoading: Boolean,
        },
    };
</script>
