<template lang="html">
    <td colspan="7" class="text-left">
        <div v-if="dateList.length>0">
            <span>{{index + 1}}. 【{{rawMaterial.PRDT_SNM}}】{{rawMaterial.specification}}：</span>
            <div v-for="date in dateList" style="display:inline-block;">
                <span style="white-space:nowrap;font-size:150%;">
                    【 {{workingMonth(date)}} / {{workingDay(date)}} 】
                </span>
            </div>
        </div>
    </td>
</template>

<script>
export default {
    name: 'shippingDateRecord',
    props: ['index', 'rawMaterial', 'shipmentList'],
    computed: {
        dateList: function ) {
            let dateList = [];
            this.shipmentList.forEach((shipment) => {
                let matched = false;
                if ((dateList.length === 0) && (
                    (shipment.PRD_NO === this.rawMaterial.PRD_NO) &&
                    (shipment.typeId === this.rawMaterial.typeId)
                )) {
                    dateList.push(shipment.workingDate);
                } else {
                    let tempDateList = dateList.slice();
                    tempDateList.forEach((date) => {
                        if (
                            (shipment.PRD_NO === this.rawMaterial.PRD_NO) &&
                            (shipment.typeId === this.rawMaterial.typeId) &&
                            (shipment.workingDate !== date)
                        ) {
                            if (!matched) {
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
        workingMonth: function dateString) {
            return new Date(dateString).getMonth() + 1;
        },
        workingDay: function dateString) {
            return new Date(dateString).getDate();
        }
    }
};
</script>

<style></style>
