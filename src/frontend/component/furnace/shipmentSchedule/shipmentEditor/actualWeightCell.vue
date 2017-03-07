<template>
    <td>
        <input
            type="number"
            pattern="[0-9.]+"
            class="form-control input-sm text-center valueInput"
            style="border:0px;"
            min="1000"
            max="99999"
            step="1"
            v-model="actualWeight" />
    </td>
</template>

<script>
    export default {
        name: 'actualWeightCell',
        props: [
            'actualWeight'
        ]
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
