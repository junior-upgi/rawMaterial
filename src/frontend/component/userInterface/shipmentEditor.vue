<template>
    <tr>
        <td>
            <span class="badge">{{index+1}}</span>
        </td>
        <td>
            <input
                type="date"
                class="form-control input-sm text-center"
                style="border:0px;"
                v-model.lazy="workingDate" />
        </td>
        <td>
            <input
                type="number"
                class="form-control input-sm text-center valueInput"
                style="border:0px;"
                min="1000"
                max="99999"
                step="1"
                v-model.lazy.number="supplierWeight" />
        </td>
        <td>
            <input
                type="number"
                pattern="[0-9.]+"
                class="form-control input-sm text-center valueInput"
                style="border:0px;"
                min="1000"
                max="99999"
                step="1"
                v-model.lazy.number="actualWeight" />
        </td>
        <td>
            <input
                type="text"
                class="form-control input-sm"
                style="border:0px;"
                v-model.trim="note" />
        </td>
        <td>
            <button
                v-if="dataModified"
                type="button"
                class="btn btn-info btn-sm"
                @click="modifyData()">
                <span class="glyphicon glyphicon-pencil"></span> 修改
            </button>
            <button
                v-if="dataExist"
                type="button"
                class="btn btn-danger btn-sm"
                @click="removeData()">
                <span class="glyphicon glyphicon-remove"></span> 清除
            </button>
            <button
                v-if="readyToSubmit && shipment.received===0"
                type="button"
                class="btn btn-primary btn-sm"
                @click="modifyData()">
                <span class="glyphicon glyphicon-floppy-disk"></span> 儲存
            </button>
            <button
                v-if="!dataExist"
                type="button"
                class="btn btn-warning btn-sm"
                @click="cancelSingleShipment()">
                <span class="glyphicon glyphicon-repeat"></span> 取消
            </button>
        </td>
    </tr>
</template>

<script>
    import { mapActions, mapMutations } from 'vuex';
    export default {
        name: 'shipmentEditor',
        props: [
            'index',
            'shipment'
        ],
        data: function() {
            return {
                requestDate: null,
                arrivalDate: null,
                workingDate: null,
                actualWeight: null,
                supplierWeight: null,
                note: null
            };
        },
        computed: {
            dataModified: function() {
                if (
                    (this.dataExist && this.readyToSubmit) &&
                    (
                        (this.shipment.workingDate !== this.workingDate) ||
                        (this.shipment.actualWeight !== this.actualWeight) ||
                        (this.shipment.supplierWeight !== this.supplierWeight) ||
                        (this.shipment.note !== this.note)
                    )
                ) {
                    return true;
                } else {
                    return false;
                }
            },
            dataExist: function() {
                return (this.shipment.workingDate && this.shipment.actualWeight && this.shipment.supplierWeight) ? true : false;
            },
            readyToSubmit: function() {
                return (this.workingDate && this.actualWeight && this.supplierWeight) ? true : false;
            }
        },
        watch: {
            workingDate: function(newDate) {
                if (newDate === '') {
                    this.workingDate = null;
                }
            },
            note: function(newNoteText) {
                if (newNoteText === '') {
                    this.note = null;
                }
            },
            actualWeight: function(newValue) {
                if ((newValue === '') || (newValue <= 1000) || (newValue > 99999)) {
                    this.actualWeight = null;
                }
            },
            supplierWeight: function(newValue) {
                if ((newValue === '') || (newValue <= 1000) || (newValue > 99999)) {
                    this.supplierWeight = null;
                }
            }
        },
        created: function() {
            this.requestDate = this.shipment.requestDate;
            this.arrivalDate = this.shipment.arrivalDate;
            this.workingDate = this.shipment.workingDate;
            this.actualWeight = this.shipment.actualWeight;
            this.supplierWeight = this.shipment.supplierWeight;
            this.note = this.shipment.note;
        },
        methods: {
            ...mapActions({
                updateShipment: 'updateShipment',
                cancelShipment: 'cancelShipment'
            }),
            ...mapMutations({
                rebuildData: 'rebuildData',
                processingDataSwitch: 'processingDataSwitch',
                resetStore: 'resetStore'
            }),
            cancelSingleShipment: function() {
                this.processingDataSwitch(true);
                this.cancelShipment({
                    id: this.shipment.id
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨取消發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            },
            modifyData: function() {
                this.processingDataSwitch(true);
                this.updateShipment({
                    id: this.shipment.id,
                    workingDate: this.workingDate,
                    supplierWeight: this.supplierWeight,
                    actualWeight: this.actualWeight,
                    note: this.note
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨資料登入發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            },
            removeData: function() {
                this.processingDataSwitch(true);
                this.updateShipment({
                    id: this.shipment.id,
                    workingDate: null,
                    supplierWeight: null,
                    actualWeight: null,
                    note: null
                }).then((resultset) => {
                    this.rebuildData(resultset.data);
                    this.processingDataSwitch(false);
                }).catch((error) => {
                    alert(`進貨資料登入發生錯誤，系統即將重置: ${error}`);
                    this.resetStore();
                });
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
    input.valueInput::-webkit-inner-spin-button,
    input.valueInput::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
