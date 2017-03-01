<template>
    <td>
        <input
            type="date"
            class="form-control input-sm text-center"
            style="border:0px;"
            v-model="workingDate" />
    </td>
</template>

<script>
    export default {
        name: 'workingDateCell',
        props: [
            'workingDate'
        ]
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
