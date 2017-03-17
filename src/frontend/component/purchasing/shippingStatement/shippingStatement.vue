<template lang="html">
    <div class="text-center col-xs-12 col-sm-10">
        <h2>進貨對帳資料表</h2>
        <br>
        <select class="form-control" v-model="selectedIndex">
            <option value="0">請選擇訂單</option>
            <option
                v-for="(activePO,index) in activePOList"
                :value="index + 1">
                【{{activePO.supplier.SNM}}】
                【訂單編號：{{activePO.pONumber}} - {{activePO.revisionNumber}}】
                【訂單類別：{{activePO.contractType}}】
                【起訖時間：{{activePO.startingDate}} 至 {{activePO.endDate}}】
            </option>
        </select>
        <br>
        <div class="table-responsive">
            <table class="table table-bordered table-hover table-striped">
                <thead>
                    <tr>
                        <th class="text-center">項次</th>
                        <th class="text-center">廠商</th>
                        <th class="text-center">原料規格</th>
                        <th class="text-center">進貨日期</th>
                        <th class="text-center">需求重量</th>
                        <th class="text-center">宣稱重量</th>
                        <th class="text-center">磅單重量</th>
                        <th class="text-center">對帳重量</th>
                        <th class="text-center">備註</th>
                    </tr>
                </thead>
                <tbody
                    style="font-size:75%;"
                    v-if="selectedIndex > 0"
                    v-for="activePO in activePOList">
                    <tr v-for="(shipment, index) in activePO.shipments"
                        v-if="activePO.id === selectedPOId">
                        <td>{{index + 1}}</td>
                        <td>{{shipment.CUS_NO}}</td>
                        <td>{{shipment.PRD_NO}} - {{shipment.typeId}}</td>
                        <td style="white-space:nowrap;">{{shipment.workingDate}}</td>
                        <td style="white-space:nowrap;">{{shipment.requestWeight|kilogram}}</td>
                        <td style="white-space:nowrap;"
                            :class="{'bg-danger':shipment.supplierWeight<shipment.actualWeight}">
                            {{shipment.supplierWeight|kilogram}}
                        </td>
                        <td style="white-space:nowrap;"
                            :class="{'bg-primary':shipment.actualWeight<=shipment.supplierWeight}">
                            {{shipment.actualWeight|kilogram}}
                        </td>
                        <td style="white-space:nowrap;"
                            :class="{'bg-danger':shipment.supplierWeight<shipment.actualWeight,'bg-primary':shipment.actualWeight<=shipment.supplierWeight}">
                            {{determineWorkingWeight(shipment.supplierWeight, shipment.actualWeight)|kilogram}}
                        </td>
                        <td>{{shipment.note}}</td>
                    </tr>
                    <tr>
                        <td colspan="7" class="text-right">對 帳 重 量 總 計</td>
                        <td style="white-space:nowrap;">{{totalWorkingWeight|kilogram}}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import numeral from 'numeral';
import { mapGetters } from 'vuex';

export default {
    name: 'shippingStatement',
    computed: {
        ...mapGetters({
            activePOList: 'activePOList'
        }),
        selectedPOId: function() {
            return (this.selectedIndex !== 0) ? this.activePOList[this.selectedIndex - 1].id : null;
        },
        totalWorkingWeight: function() {
            if (this.selectedIndex === 0) {
                return null;
            } else {
                let sum = 0;
                this.activePOList[this.selectedIndex - 1].shipments.forEach((shipment) => {
                    if ((shipment.supplierWeight !== null) && (shipment.actualWeight !== null)) {
                        sum += (shipment.actualWeight <= shipment.SupplierWeight) ? shipment.actualWeight : shipment.supplierWeight;
                    }
                });
                return sum;
            }
        }
    },
    data: function() {
        return {
            selectedIndex: 0
        };
    },
    methods: {
        determineWorkingWeight: function(supplierWeight, actualWeight) {
            if ((supplierWeight === null) && (actualWeight === null)) {
                return null;
            }
            return (actualWeight <= supplierWeight) ? actualWeight : supplierWeight;
        }
    },
    filters: {
        kilogram: function(value) {
            return (value !== null) ? `${numeral(value).format('0,0')} 公斤` : null;
        }
    }
};
</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
