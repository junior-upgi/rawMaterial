<template>
    <div>
        <div class="row">
            <h3>{{workingYear}} 年 {{workingMonth}} 月份原料進廠概況</h3>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th class="text-center">項目</th>
                    <th class="text-center">日期</th>
                    <th class="text-center">廠商</th>
                    <th class="text-center">重量</th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot></tfoot>
        </table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'shipmentOverview',
        computed: {
            ...mapGetters({
                workingMonth: 'getWorkingMonth',
                workingYear: 'getWorkingYear'
            })
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
