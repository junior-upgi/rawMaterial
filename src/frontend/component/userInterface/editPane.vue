<template>
    <tr class="danger">
        <td colspan="6" class="danger">
            <div class="col-xs-offset-1 col-xs-11 bg-danger">
                <div class="panel panel-default">
                    <div class="panel-heading">{{editPaneHeading}}</div>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center">車次</th>
                                    <th class="text-center">實際入廠日期</th>
                                    <th class="text-center">廠商宣稱重量</th>
                                    <th class="text-center">實際磅單重量</th>
                                    <th>備註</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <shipment-editor
                                    v-for="(shipment,index) in shipmentFilter()"
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
        props: ['paneDateString'],
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
                    return shipment.requestDate === this.paneDateString;
                });
            }
        },
        created: function() {
            this.editPaneHeading = `${this.paneDateString}【${this.selectedRawMat.CUS_SNM}】${this.selectedRawMat.PRDT_SNM} - ${this.selectedRawMat.specification}進廠資料編輯`;
        }
    };

</script>
