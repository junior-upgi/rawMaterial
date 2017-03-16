<template>
    <span>
            <button
                class="btn btn-primary" style="border:0px;"
                :disabled="dataProcessingState?true:false"
                @click.stop="prevMonth">
                <span class="glyphicon glyphicon-triangle-left"></span>
    </button>
    &nbsp;{{workingYear}} 年 {{workingMonth}} 月份
    <button class="btn btn-primary" style="border:0px;" :disabled="dataProcessingState?true:false" @click.stop="nextMonth">
        <span class="glyphicon glyphicon-triangle-right"></span>
    </button>
    </span>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
    name: 'workingTimeSelector',
    computed: {
        ...mapGetters({
            dataProcessingState: 'checkDataProcessingState',
            workingMonth: 'workingMonth',
            workingYear: 'workingYear'
        })
    },
    methods: {
        ...mapActions({
            nextWorkingMonth: 'nextWorkingMonth',
            prevWorkingMonth: 'prevWorkingMonth'
        }),
        ...mapMutations({ buildStore: 'buildStore' }),
        nextMonth: function() {
            this.nextWorkingMonth()
                .then((responseList) => {
                    this.buildStore(responseList);
                    this.$emit('workingTimeChange');
                })
                .catch((error) => {
                    alert(`作業月份選擇發生錯誤，請重新載入...\n${error.errorMessage}`);
                });
        },
        prevMonth: function() {
            this.prevWorkingMonth()
                .then((responseList) => {
                    this.buildStore(responseList);
                    this.$emit('workingTimeChange');
                })
                .catch((error) => {
                    alert(`作業月份選擇發生錯誤，請重新載入...\n${error.errorMessage}`);
                });
        }
    }
};

</script>

<style>
@import './bower_components/bootstrap/dist/css/bootstrap.min.css';
</style>
