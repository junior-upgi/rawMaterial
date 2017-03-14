<template>
    <td class="text-left">
        <div
            v-for="record in receivingRecord"
            style="margin-right:3px;margin-bottom:3px;display:inline-block;">
            <span
                v-if="record.receivedWeight>0"
                style="padding:2px;"
                class="label label-primary">
                {{record.workingMonth}}/{{record.workingDay}}
            </span>
            <span
                v-else
                class="label label-danger"
                style="padding:2px;">
                {{record.workingMonth}}/{{record.workingDay}}
            </span>
        </div>
    </td>
</template>

<script>
    export default {
        name: 'graphicalDate',
        props: ['receivingRecord']
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
