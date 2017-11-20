<template>
    <div class="statistics-photo-stat">
        <div class='row'>
            <div class='block'>
                <div class="block-content" data-url="../photo-stat/photos.html">
                    <div class="count" v-text="photoCounts"></div>
                    <div class="text">累积照片数</div>
                </div>
            </div>
            <div class='block'>
                <div class="block-content" data-url="../photo-stat/photographer.html">
                    <div class="count" v-text="photographerCounts"></div>
                    <div class="text">累积（上传）摄影师</div>
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='block'>
                <div class="block-content" data-url="../photo-stat/auditing-photo.html">
                    <div class="count" v-text="photoAuditCounts"></div>
                    <div class="text">累积审片数</div>
                </div>
            </div>
            <div class='block'>
                <div class="block-content">
                    <div class="count" v-text="photoUpdateCounts"></div>
                    <div class="text">累积修片数（未开通）</div>
                </div>
            </div>
        </div>
        <div class='row'>
            <div class='block'>
                <div class="block-content" data-url="../photo-stat/excellent-photo.html">
                    <div class="count" v-text="photoChiceCounts"></div>
                    <div class="text">累积精品照片数</div>
                </div>
            </div>
            <div class='block'>
                <div class="block-content" data-url="../photo-stat/disk-space.html">
                    <div class="count" >
                        <span v-text="photoCapacity"></span><span class="unit"> GB</span>
                    </div>
                    <div class="text">累积存储空间</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Request from "./Request";
    export default {
        data() {
            return {
                photoCounts: 0,
                photographerCounts: 0,
                photoAuditCounts: 0,
                photoUpdateCounts: 0,
                photoChiceCounts: 0,
                photoCapacity: 0
            }
        },
        methods: {
            init() {
                var that = this;
                var url = "/report/photo/selectPhotoIndexCount";
                var params = {};
                Request.getJson(url, params, function(res) {
                    for(var attr in res.data) {
                        that[attr] = res.data[attr]
                    }
                    that.photoCapacity = (res.data.photoCapacity/1024/1024/1024).toFixed(2);
                });
            }
        },
        mounted() {
            var that = this;
            lf.ready(function() {
                that.init();
                mui('.statistics-photo-stat').on('tap', '.block-content', function() {
                    var url = this.getAttribute('data-url');
                    if(url) {
                        lf.window.openWindow(url, url, {}, {
                        })
                    } else {
                        lf.nativeUI.toast('功能尚未开通');
                    }
                });
            });
        }
    }
</script>
<style lang="scss">
    .statistics-photo-stat {
        display: flex;
        flex-direction: column;
        .row {
            flex: 1;
            display: flex;
            height: 3.25rem;
            .block {
                flex: 1;
                display: flex;
                padding: 5px;
                .block-content {
                    flex: 1;
                    display: flex;
                    border: 1px solid #c5c5c5;
                    background: #eaeaea;
                    border-radius: 10px;
                    flex-direction: column;
                    .count {
                        flex: 1;
                        font-size: 0.6rem;
                        .unit {
                            color: #888;
                            font-size: 0.2rem;
                        }
                    }
                    .text {
                        flex: 0.5;
                        font-size: 0.28rem;
                        color: #888;
                    }
                    div {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
        }
    }
</style>
