<template>
    <td>
        <div id="received" class="bg-primary">{{receivedTonnage|tonnage}} 已入廠</div>
        <div id="pending" class="bg-info">{{pendingTonnage|tonnage}} 待入廠</div>
    </td>
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters } from 'vuex';

    export default {
        name: 'tonnageDisplay',
        props: ['CUS_NO', 'PRD_NO'],
        computed: {
            ...mapGetters({
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear',
                tonnageSummary: 'getTonnageSummary'
            }),
            pendingTonnage: function() {
                let pendingTonnage = this.tonnageSummary.filter((dataEntry) => {
                    return (
                        (dataEntry.CUS_NO === this.CUS_NO) &&
                        (dataEntry.PRD_NO === this.PRD_NO) &&
                        (dataEntry.workingYear === this.workingYear) &&
                        (dataEntry.workingMonth === this.workingMonth) &&
                        (dataEntry.received === 0)
                    );
                });
                return pendingTonnage.length === 0 ? 0 : pendingTonnage[0].workingWeight;
            },
            receivedTonnage: function() {
                let receivedTonnage = this.tonnageSummary.filter((dataEntry) => {
                    return (
                        (dataEntry.CUS_NO === this.CUS_NO) &&
                        (dataEntry.PRD_NO === this.PRD_NO) &&
                        (dataEntry.workingYear === this.workingYear) &&
                        (dataEntry.workingMonth === this.workingMonth) &&
                        (dataEntry.received === 1)
                    );
                });
                return receivedTonnage.length === 0 ? 0 : receivedTonnage[0].workingWeight;
            }
        },
        filters: {
            tonnage: function(value) {
                return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 頓`;
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    div#received,
    div#pending {
        white-space: nowrap;
        padding-left: 5px;
        padding-right: 5px;
    }

</style>
