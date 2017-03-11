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
                                    <th v-for="thItem in thList" class="text-center">{{thItem}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <shipment-editor
                                    v-for="(shipment,index) in shipmentSchedule"
                                    :shipment="shipment"
                                    :index="index+1">
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
    import shipmentEditor from './shipmentEditor/shipmentEditor.vue';

    export default {
        name: 'editPane',
        components: { shipmentEditor },
        props: [
            'dateInEditMode',
            'shipmentSchedule'
        ],
        computed: {
            ...mapGetters({
                selectedRawMaterial: 'selectedRawMaterial'
            })
        },
        data: function() {
            return {
                editPaneHeading: null,
                thList: ['', '車次', '入廠日期', '廠商宣稱重量', '實際磅單重量', '備註', '']
            };
        },
        created: function() {
            this.editPaneHeading = `${this.dateInEditMode}【${this.selectedRawMaterial.CUST_SNM}】${this.selectedRawMaterial.PRDT_SNM} - ${this.selectedRawMaterial.specification} 進廠資料編輯`;
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
