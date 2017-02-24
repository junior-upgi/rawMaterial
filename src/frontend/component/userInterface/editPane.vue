<template>
    <tr class="danger">
        <td colspan="7">
            <div class="col-xs-offset-1 col-xs-11">
                <div class="panel panel-default">
                    <div class="panel-heading">{{editPaneHeading}}</div>
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th class="text-center">車次</th>
                                    <th class="text-center">入廠日期</th>
                                    <th class="text-center">廠商宣稱重量</th>
                                    <th class="text-center">實際磅單重量</th>
                                    <th class="text-center">備註</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <shipment-editor
                                    v-for="(shipment,index) in shipmentFilter()"
                                    v-if="shipment.received===received"
                                    :shipment="shipment"
                                    :index="index">
                                </shipment-editor>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </td>
    </tr>
</template>

<script>
    import { mapGetters } from 'vuex';
    import shipmentEditor from './shipmentEditor.vue';

    export default {
        name: 'editPane',
        components: { shipmentEditor },
        props: ['paneDateString', 'received'],
        computed: {
            ...mapGetters({
                monthlySchedule: 'getMonthlySchedule',
                selectedRawMat: 'getSelectedRawMat'
            })
        },
        data: function() {
            return {
                editPaneHeading: null
            };
        },
        methods: {
            shipmentFilter: function() {
                return this.monthlySchedule.filter((shipment) => {
                    return shipment.workingDate === this.paneDateString;
                });
            }
        },
        created: function() {
            this.editPaneHeading = `${this.paneDateString}【${this.selectedRawMat.CUS_SNM}】${this.selectedRawMat.PRDT_SNM} - ${this.selectedRawMat.specification}進廠資料編輯`;
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
