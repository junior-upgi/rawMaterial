<template>
    <tr style="font-size:75%;">
        <td>{{monthlyShipmentOverview.CUST_SNM}}</td>
        <td style="white-space:nowrap;">{{monthlyShipmentOverview.PRDT_SNM}}</td>
        <graphicalDate :receivingRecord="filterReceivingRecord"></graphicalDate>
        <td style="white-space:nowrap;">{{monthlyShipmentOverview.receivedCount}} / {{monthlyShipmentOverview.shipmentCount}}</td>
        <td style="white-space:nowrap;">{{monthlyShipmentOverview.totalReceivedWeight|tonnage}} / {{monthlyShipmentOverview.totalRequestWeight|tonnage}}</td>
    </tr>
</template>

<script>
import numeral from 'numeral';
import { mapGetters } from 'vuex';
import graphicalDate from './graphicalDate.vue';

export default {
    name: 'shipmentOverviewRecord',
    components: { graphicalDate },
    props: ['monthlyShipmentOverview'],
    computed: {
        ...mapGetters({
            receivingRecord: 'receivingRecord',
            workingYear: 'workingYear',
            workingMonth: 'workingMonth'
        }),
        filterReceivingRecord: function() {
            return this.receivingRecord.filter((record) => {
                return (
                    (record.CUS_NO === this.monthlyShipmentOverview.CUS_NO) &&
                    (record.PRD_NO === this.monthlyShipmentOverview.PRD_NO) &&
                    (record.workingYear === this.workingYear) &&
                    (record.workingMonth === this.workingMonth)
                );
            });
        }
    },
    filters: {
        tonnage: function(value) {
            return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 噸`;
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
