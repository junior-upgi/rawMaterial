<template>
    <div>
        <div>{{NAME}}</div>
        <div class="row">
            {{CMP_ADR}}&nbsp;&nbsp;&nbsp;
            TEL:&nbsp;{{TEL1}}&nbsp;&nbsp;&nbsp;
            FAX:&nbsp;{{TEL3}}
        </div>
        <div class="row">
            <span>{{documentTitle}}</span>
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
