<template lang="html">
    <td>
        <ul class="list-group" style="margin:0px;">
            <li v-for="(summaryItem,index) in pOContentSummary" class="list-group-item text-left" style="border:0px;margin:0px;padding:0px 5px 0px 5px;">
                <div style="white-space:nowrap;">
                    【{{index+1}}】 {{summaryItem.PRDT_SNM}}【{{summaryItem.specification}}】
                </div>
                <div style="white-space:nowrap;">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入廠車次： {{summaryItem.receivedShipmentCount}} / {{summaryItem.requestShipmentCount}}</div>
                <div style="white-space:nowrap;">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;進貨重量： {{summaryItem.totalReceivedWeight|tonnage}} / {{summaryItem.totalRequestedWeight|tonnage}}
                </div>
            </li>
        </ul>
    </td>
</template>

<script>
import numeral from 'numeral';
export default {
    name: 'contentSummary',
    props: ['pOContentSummary'],
    filters: {
        tonnage: function(value) {
            return `${numeral(Math.round(value / 100) / 10).format('0,0.0')} 噸`;
        }
    }
};
</script>

<style></style>
