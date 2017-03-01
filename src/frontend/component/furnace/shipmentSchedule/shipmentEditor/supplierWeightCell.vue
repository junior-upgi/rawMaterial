<template>
    <td>
        <input
            type="number"
            class="form-control input-sm text-center valueInput"
            style="border:0px;"
            min="1000"
            max="99999"
            step="1"
            v-model="supplierWeight" />
    </td>
</template>

<script>
    export default {
        name: 'supplierWeightCell',
        props: [
            'supplierWeight'
        ]
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
