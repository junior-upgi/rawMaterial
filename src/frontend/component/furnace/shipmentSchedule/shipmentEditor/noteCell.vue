<template>
    <td>
        <input
            type="text"
            class="form-control input-sm"
            style="border:0px;"
            v-model="note" />
    </td>
</template>

<script>
    export default {
        name: 'noteCell',
        props: [
            'note'
        ]
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
