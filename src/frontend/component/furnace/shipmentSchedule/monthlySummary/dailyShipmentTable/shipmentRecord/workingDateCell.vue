<template>
    <input
        type="date"
        class="form-control input-sm"
        style="border:0px;"
        v-model.lazy="workingDateValue"
        @change="workingDateUpdated()" />
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'workingDateCell',
        props: [
            'recordState',
            'workingDateString'
        ],
        computed: { ...mapGetters({ activeShipmentEditorDate: 'activeShipmentEditorDate' }) },
        data: function() {
            return {
                workingDateValue: this.workingDateString
            };
        },
        watch: {
            activeShipmentEditorDate: function() {
                this.workingDateValue = this.workingDateString;
            },
            workingDateValue: function(newDateValue) {
                if (newDateValue === '') { this.workingDate = null; }
            }
        },
        methods: {
            workingDateUpdated: function() {
                this.$emit('workingDateUpdated', this.workingDateValue);
            }
        }
    };

</script>

<style>
    @import './bower_components/bootstrap/dist/css/bootstrap.min.css';

</style>
