<template>
    <div
        class="container-fluid"
        style="margin-top:20px;margin-bottom:20px;">
        <div class="row">
            <h1>{{NAME}}</h1>
        </div>
        <div class="row">
            <h4 style="margin-top:0px;">
                {{CMP_ADR}} TEL:{{TEL1}} FAX:{{TEL3}}
            </h4>
        </div>
        <div class="row">
            <h2 style="margin-top:0px;">
                <span>{{documentTitle}}</span>
            </h2>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'documentHeading',
        props: ['documentTitle'],
        data: function() {
            return {
                NAME: '統義玻璃工業股份有限公司',
                CMP_ADR: '台南市新營區新工路36號',
                TEL1: '06-6536281',
                TEL3: '06-6532530'
            };
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
