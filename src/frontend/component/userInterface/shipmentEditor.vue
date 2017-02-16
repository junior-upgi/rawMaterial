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
                v-model="arrivalDate" />
        </td>
        <td>
            <input
                type="number"
                class="form-control input-sm text-center"
                style="border:0px;"
                v-model="supplierWeight" />
        </td>
        <td>
            <input
                type="number"
                class="form-control input-sm text-center"
                style="border:0px;"
                v-model="actualWeight" />
        </td>
        <td>
            <input
                type="text"
                class="form-control input-sm text-center"
                style="border:0px;"
                v-model="note" />
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-sm">
                <span class="glyphicon glyphicon-remove"></span> 刪除
            </button>
            <button type="button" class="btn btn-primary btn-sm">
                <span class="glyphicon glyphicon-pencil"></span> 寫入
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
        created: function() {
            this.arrivalDate = this.shipment.arrivalDate;
            this.actualWeight = this.shipment.actualWeight;
            this.supplierWeight = this.shipment.supplierWeight;
            this.note = this.shipment.note;
        }
    };

</script>
