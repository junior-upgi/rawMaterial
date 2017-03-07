<template>
    <div class="text-center">
        <h2>採購模組</h2>
        <br>
        <pOOverview></pOOverview>
        <div class="row">
            <div class="col-md-8">
                <!--
                <shipmentOverview :workingMaterial="workingMaterial"></shipmentOverview>
                -->
            </div>
            <!--
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
            -->
        </div>
    </div>
</template>

<script>
    import pOOverview from './pOOverview/pOOverview.vue';
    // import shipmentOverview from './shipmentOverview.vue';

    export default {
        name: 'purchasing',
        components: {
            pOOverview
            // shipmentOverview
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
