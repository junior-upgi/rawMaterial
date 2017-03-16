<template>
    <div>
        <div class="row" style="margin:0px;padding:0px;">
            <h1 style="margin:0px;padding:0px;">{{NAME}}</h1>
        </div>
        <div class="row" style="margin:10px;padding:0px;">
            <h4 style="margin:0px;padding:0px;">
                    {{CMP_ADR}}&nbsp;&nbsp;&nbsp;
                    TEL:&nbsp;{{TEL1}}&nbsp;&nbsp;&nbsp;
                    FAX:&nbsp;{{TEL3}}
                </h4>
        </div>
        <div class="row" style="margin:10px;padding:0px;">
            <h2 style="margin:0px;padding:0px;">{{documentTitle}}</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: 'documentHeading',
    props: ['documentTitle'],
    data: function() {
        return {
            NAME: '統 義 玻 璃 工 業 股 份 有 限 公 司',
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
