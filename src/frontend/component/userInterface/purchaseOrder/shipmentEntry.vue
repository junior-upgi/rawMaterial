<template>
    <a
        class="list-group-item text-left"
        style="border:2px white solid"
        :class="{active:activeState}"
        @click.self="switchActiveState()">
        項次：{{index+1}}&nbsp;
        進廠時間：{{shipment.workingDate}}&nbsp;
        項目：{{shipment.PRDT_SNM}}&nbsp;
        規格：{{shipment.specification}}&nbsp;
        重量：{{shipment.workingWeight|formatWeight}} {{shipment.UT}}&nbsp;
        單價：{{shipment.unitPrice|formatCurrency}}&nbsp;
        小計：{{shipment.unitPrice*shipment.workingWeight|formatCurrency}}&nbsp;
        備註：{{shipment.note}}
    </a>
</template>

<script>
    import numeral from 'numeral';
    import { mapGetters } from 'vuex';
    export default {
        name: 'shipmentEntry',
        props: ['index', 'shipment'],
        data: function() { return { activeState: null }; },
        computed: {
            ...mapGetters({ dataProcessingState: 'checkDataProcessingState' })
        },
        filters: {
            formatWeight: function(weight) {
                return numeral(weight).format('0,0');
            },
            formatCurrency: function(amount) {
                return '$' + numeral(amount).format('0,0.00');
            }
        },
        methods: {
            checkDefaultActiveState: function() {
                return (
                    (this.shipment.received === 1) ||
                    (this.shipment.deprecated === null)
                ) ? true : false;
            },
            switchActiveState: function() {
                if (this.activeState === true) {
                    this.activeState = false;
                    this.$emit('shipmentDeselection', this.shipment);
                } else {
                    this.activeState = true;
                    this.$emit('shipmentSelection', this.shipment);
                }
            }
        },
        created: function() {
            this.unitPrice = this.shipment.unitPrice;
            this.note = this.shipment.note;
            this.editMode = false;
            if (this.checkDefaultActiveState()) {
                this.activeState = true;
                this.$emit('shipmentSelection', this.shipment);
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    input.shipmentEntryInput::-webkit-inner-spin-button,
    input.shipmentEntryInput::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
