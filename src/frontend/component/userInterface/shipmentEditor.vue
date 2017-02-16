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
                v-model.lazy="arrivalDate" />
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
                type="button"
                class="btn btn-info btn-sm"
                v-if="dataModified"
                @click="modifyData()">
                <span class="glyphicon glyphicon-pencil"></span> 修改
            </button>
            <button
                type="button"
                class="btn btn-danger btn-sm"
                v-if="dataExist"
                @click="removeData()">
                <span class="glyphicon glyphicon-remove"></span> 刪除
            </button>
            <button
                type="button"
                class="btn btn-primary btn-sm"
                v-if="readyToSubmit"
                @click="submitData()">
                <span class="glyphicon glyphicon-floppy-disk"></span> 儲存
            </button>
            <button
                type="button"
                class="btn btn-warning btn-sm"
                v-if="!dataExist"
                @click="cancelShipment()">
                <span class="glyphicon glyphicon-repeat"></span> 取消
            </button>
        </td>
    </tr>
</template>
<script>
    export default {
        name: 'shipmentEditor',
        props: [
            'index',
            'shipment'
        ],
        data: function() {
            return {
                arrivalDate: null,
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
                        (this.shipment.arrivalDate !== this.arrivalDate) ||
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
                return (this.shipment.arrivalDate && this.shipment.actualWeight && this.shipment.supplierWeight) ? true : false;
            },
            readyToSubmit: function() {
                return (this.arrivalDate && this.actualWeight && this.supplierWeight) ? true : false;
            }
        },
        watch: {
            arrivalDate: function(newDate) {
                if (newDate === '') {
                    this.arrivalDate = null;
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
            this.arrivalDate = this.shipment.arrivalDate;
            this.actualWeight = this.shipment.actualWeight;
            this.supplierWeight = this.shipment.supplierWeight;
            this.note = this.shipment.note;
        },
        methods: {
            modifyData: function() {
                alert('not implemented');
            },
            removeData: function() {
                alert('not implemented');
            },
            submitData: function() {
                alert('not implemented');
            },
            cancelShipment: function() {
                alert('not implemented');
            }
        }
    };

</script>

<style>
    input.valueInput::-webkit-inner-spin-button,
    input.valueInput::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

</style>
