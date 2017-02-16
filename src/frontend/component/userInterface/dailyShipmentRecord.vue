<template>
    <tr @click="switchEditModeDate()" :class="{danger:checkInEditMode()}">
        <td>{{dailyShipmentSummary.requestDate}}</td>
        <td>{{dailyShipmentSummary.CUS_SNM}}</td>
        <td>{{dailyShipmentSummary.PRDT_SNM}}</td>
        <td class="text-left">{{dailyShipmentSummary.specification}}</td>
        <td>{{dailyShipmentSummary.quantity}}</td>
        <td>{{dailyShipmentSummary.estWeight|tonnage(dailyShipmentSummary.quantity)}}</td>
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
                return `${numeral(Math.round((value) / 1000)).format('0,0.0')} 噸`;
            }
        },
        methods: {
            ...mapMutations({
                switchDateInEditMode: 'switchDateInEditMode',
                turnOffEditMode: 'turnOffEditMode'
            }),
            checkInEditMode: function() {
                if ((this.dateInEditMode === null) || (this.dateInEditMode !== this.dailyShipmentSummary.requestDate)) {
                    return false;
                } else {
                    return true;
                }
            },
            switchEditModeDate: function() {
                if (this.checkInEditMode()) {
                    this.turnOffEditMode();
                } else {
                    this.switchDateInEditMode(this.dailyShipmentSummary.requestDate);
                }
            }
        }
    };

</script>
