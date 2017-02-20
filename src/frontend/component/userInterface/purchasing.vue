<template>
    <div class="text-center">
        <h2>採購模組</h2>
        <br>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h4>
                    <  2017 年 2 月份  >  採購訂單狀況
                </h4>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered tabel-hover table-striped table-condensed">
                    <thead>
                        <tr>
                            <th class="text-center">廠商</th>
                            <th class="text-center">項目</th>
                            <th class="text-center">規格</th>
                            <th class="text-center">訂單編號</th>
                            <th class="text-center">最新訂單時間點</th>
                            <th class="text-center">新變更時間點</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="index in 7">
                            <td>廠商 {{index}}</td>
                            <td>規格</td>
                            <td class="text-left" style="white-space:nowrap;">
                                <div style="padding-left:10px;">規格1規格1規格1規格1</div>
                                <div style="padding-left:10px;">規格2規格2規格2規格2規格2規格2規格2</div>
                                <div style="padding-left:10px;">規格3規格3規格3規格3規格3規格3規格3規格3規格3</div>
                            </td>
                            <td style="white-space:nowrap;">PO10502190001</td>
                            <td>
                                <span style="white-space:nowrap;">2017-02-07 08:00</span>
                                <span class="glyphicon glyphicon-question-sign"></span>
                                <span class="glyphicon glyphicon-ok-sign"></span>
                            </td>
                            <td>
                                <span style="white-space:nowrap;">2017-02-08 19:30</span>&nbsp;
                                <button class="btn btn-xs btn-danger">重新下單</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <shipment-overview></shipment-overview>
            </div>
            <div class="col-md-4">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h4>聯絡人資料</h4>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered table-hover table-condensed">
                            <thead>
                                <tr>
                                    <th class="text-left">廠商</th>
                                    <th class="text-center">聯絡人</th>
                                    <th class="text-center">電話</th>
                                    <th class="text-center">傳真</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="index in 7">
                                    <td class="text-left" style="white-space:nowrap;">廠商</td>
                                    <td class="text-center" style="white-space:nowrap;">某某人</td>
                                    <td class="text-center" style="white-space:nowrap;">09xxxxxxxx</td>
                                    <td class="text-center" style="white-space:nowrap;">06xxxxxxx</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import shipmentOverview from './shipmentOverview.vue';

    export default {
        name: 'purchasing',
        components: {
            shipmentOverview
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
