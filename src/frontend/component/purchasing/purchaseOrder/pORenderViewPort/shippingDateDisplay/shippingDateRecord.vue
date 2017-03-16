<template>
    <td colspan="7" class="text-left">
        {{index + 1}}. 【{{rawMaterial.PRDT_SNM}}】{{rawMaterial.specification}}
        <span v-for="date in dateList">【{{workingMonth(date)}}/{{workingDay(date)}}】</span>
    </td>
</template>

<script>
    export default {
        name: 'shippingDateRecord',
        props: ['index', 'rawMaterial', 'shipmentList'],
        computed: {
            dateList: function() {
                let dateList = [];
                this.shipmentList.forEach((shipment) => {
                    console.log('shipmentList loop: ' + shipment.workingDate);
                    let matched = false;
                    if(dateList.length === 0) {
                        dateList.push(shipment.workingDate);
                    } else {
                        let tempDateList = dateList.slice();
                        tempDateList.forEach((date) => {
                            console.log('tempDateList loop: ' + date);
                            if(
                                (shipment.PRD_NO === this.rawMaterial.PRD_NO) &&
                                (shipment.typeId === this.rawMaterial.typeId) &&
                                (shipment.workingDate !== date)
                            ) {
                                if(!matched) {
                                    dateList.push(shipment.workingDate);
                                    matched = true;
                                }
                            }
                        });
                    }
                });
                return dateList;
            }
        },
        methods: {
            workingMonth: function(dateString) {
                return new Date(dateString).getMonth() + 1;
            },
            workingDay: function(dateString) {
                return new Date(dateString).getDate();
            }
        }
    };
</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
