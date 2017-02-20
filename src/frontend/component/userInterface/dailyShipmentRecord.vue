<template>
    <tr @click="switchEditModeDate()"
        :class="{'danger':checkInEditMode()}">
        <td v-if="dailyShipmentSummary.received===1">
            <span class="glyphicon glyphicon-ok-circle"></span> 已進場
        </td>
        <td v-else>待進場</td>
        <td>{{dailyShipmentSummary.workingDate}}</td>
        <td>{{dailyShipmentSummary.CUS_SNM}}</td>
        <td>{{dailyShipmentSummary.PRDT_SNM}}</td>
        <td>{{dailyShipmentSummary.specification}}</td>
        <td>{{dailyShipmentSummary.quantity}}</td>
        <td>{{dailyShipmentSummary.workingWeight|tonnage(dailyShipmentSummary.quantity)}}</td>
    </tr>
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'dailyShipmentRecord',
        props: ['dailyShipmentSummary'],
        computed: {
            ...mapGetters({ dateInEditMode: 'checkDateInEditMode' })
        },
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round((value) / 100)).format('0,0.0') / 10} 噸`;
            }
        },
        methods: {
            ...mapMutations({
                switchDateInEditMode: 'switchDateInEditMode',
                turnOffEditMode: 'turnOffEditMode'
            }),
            checkInEditMode: function() {
                if ((this.dateInEditMode === null) || (this.dateInEditMode !== this.dailyShipmentSummary.workingDate)) {
                    return false;
                } else {
                    return true;
                }
            },
            switchEditModeDate: function() {
                if (this.checkInEditMode()) {
                    this.turnOffEditMode();
                } else {
                    this.switchDateInEditMode(this.dailyShipmentSummary.workingDate);
                }
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
