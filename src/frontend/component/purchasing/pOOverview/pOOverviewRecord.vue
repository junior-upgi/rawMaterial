<template>
    <tr>
        <pODisplayCell :pOList="pOList" :CUS_NO="material.CUS_NO"></pODisplayCell>
        <td style="white-space:nowrap;">{{material.CUS_SNM}}</td>
        <td style="white-space:nowrap;">{{material.PRDT_SNM}}</td>
        <supplyingSpecList :CUS_NO="material.CUS_NO"></supplyingSpecList>
        <td>
            <span style="white-space:nowrap;">2017-02-07 08:00</span>
            <span style="white-space:nowrap;">
                <span class="glyphicon glyphicon-question-sign">待確認</span>
                <span class="glyphicon glyphicon-ok-sign">已確認</span>
            </span>
        </td>
        <td>
            <span style="white-space:nowrap;">2017-02-08 19:30</span>&nbsp;
            <button class="btn btn-xs btn-danger">修改訂單</button>
        </td>
    </tr>
</template>

<script>
    import supplyingSpecList from './supplyingSpecList.vue';
    import pODisplayCell from './pODisplayCell.vue';

    export default {
        name: 'pOOverviewRecord',
        components: {
            supplyingSpecList,
            pODisplayCell
        },
        props: ['material', 'pOList']
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
