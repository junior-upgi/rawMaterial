<template>
    <td class="text-left">
        <div
            v-for="record in receivingRecord"
            style="margin-right:3px;margin-bottom:3px;display:inline-block;">
            <span
                v-if="record.receivedWeight>0"
                style="padding:2px;"
                class="label"
                :class="{'label-primary':isCurrentDate(record.workingDate),'label-success':!isCurrentDate(record.workingDate)}">
                {{record.workingMonth}}/{{record.workingDay}}
            </span>
            <span
                v-else
                style="padding:2px;"
                class="label"
                :class="{'label-primary':isCurrentDate(record.workingDate),'label-danger':!isCurrentDate(record.workingDate)}">
                {{record.workingMonth}}/{{record.workingDay}}
            </span>
        </div>
    </td>
</template>

<script>
    import moment from 'moment-timezone';
    export default {
        name: 'graphicalDate',
        props: ['receivingRecord'],
        methods: {
            isCurrentDate: function(dateString) {
                return (moment(new Date()).format('YYYY-MM-DD') === dateString) ? true : false;
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
