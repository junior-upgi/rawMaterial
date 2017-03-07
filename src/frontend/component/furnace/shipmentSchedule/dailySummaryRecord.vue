<template>
    <tr @click="dailySummaryRecordToggled">
        <td></td>
        <td>{{shipmentSummaryItem.workingDate}}</td>
        <td>{{shipmentSummaryItem.CUST_SNM}}</td>
        <td>{{shipmentSummaryItem.PRDT_SNM}}</td>
        <td>{{shipmentSummaryItem.specification}}</td>
        <td>{{shipmentSummaryItem.totalShipmentCount}}</td>
        <td>{{shipmentSummaryItem.totalWeight|tonnage}}</td>
    </tr>
</template>

<script>
    import numeral from 'numeral';
    // import { mapGetters, mapMutations } from 'vuex';

    export default {
        name: 'dailySummaryRecord',
        props: [
            'dateInEditMode',
            'shipmentSummaryItem'
        ],
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round((value) / 100) / 10).format('0,0.0')} 噸`;
            }
        },
        computed: {
            // ...mapGetters({ dateInEditMode: 'checkDateInEditMode' }),
            inEditMode: function() {
                return this.dateInEditMode === this.shipmentSummaryItem.workingDate ? true : false;
            }
        },
        methods: {
            dailySummaryRecordToggled: function() {
                this.$emit('dailySummaryRecordSelected', this.shipmentSummaryItem.workingDate);
            }
        }
        /* ,
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
        */
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
