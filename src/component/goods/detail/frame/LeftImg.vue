<template>
    <div class="magnifier" id="magnifier1">
        <div class="magnifier-container">
            <div class="images-cover"></div>
            <!--当前图片显示容器-->
            <div class="move-view"></div>
            <!--跟随鼠标移动的盒子-->
        </div>
        <div class="magnifier-assembly">
            <div class="magnifier-btn">
                <span class="magnifier-btn-left">&lt;</span>
                <span class="magnifier-btn-right">&gt;</span>
            </div>
            <!--按钮组-->
            <div class="magnifier-line">
                <ul class="clearfix animation03">
                    <li v-for="item in imglist" :key="item.id">
                        <div class="small-img">
                            <img :src="item.original_path" />
                        </div>
                    </li>
                </ul>
            </div>
            <!--缩略图-->
        </div>
        <div class="magnifier-view"></div>
        <!--经过放大的图片显示容器-->
    </div>
</template>

<script>
     // 导入jQuery放大镜插件, 该插件依赖与jQuery变量, 所以我们在它的源代码里import了一下
    import '../../../../../lib/imgzoom/js/magnifier.js';
    // 导入$, 接下来要调用插件方法
    import $ from 'jquery';
   
    export default {
        props: ['imglist'],

        mounted() {
            // 第一个原因:
            // 因为magnifier1有v-for,写的任何一个指令或者组件它都相当于一个子的组件要进行一些处理的，
            // 这些处理mounted不能保证已经处理完毕，只是放上去了，放上去之后还要有进一步处理，可能完毕可能没完毕
            // 父亲元素能找到，儿子元素找不到不存在
            // 两种情况有可能同时出现
            //解决方案$nextTick，在修改数据之后使用它，然后等待dom更新，但是当前函数数据有可能不存在，执行不了
        
        //    this.$nextTick(function () {
        //         console.log("-------------------------------------");
        //             console.log($('.magnifier img'));
        //             console.log("-----------------");
        //             console.log(this.imglist);
        //             var _magnifier = $().imgzoon({
        //                 magnifier : "#magnifier1",//最外层的大容器
        //                 width : 370,//承载容器宽
        //                 height : 370,//承载容器高
        //                 moveWidth : null,//如果设置了移动盒子的宽度，则不计算缩放比例
        //                 zoom : 5//缩放比例
        //             });
        //         });
        },

        // 监听imglist的变化, 每次变化都要重新的初始化放大镜插件
        // 官方文档: https://cn.vuejs.org/v2/api/#vm-nextTick
        watch: {
             // 第二个原因:
        // 该函数只会执行一次, 执行的那一次, imglist刚好是空数组
        // 等imglist有值的时候, 该函数不会执行了, 那么插件也无法生效
        // 异步接口还没返回好，而mounted只在视图挂载的时候执行，比异步接口快，对imglist监听有变化才执行代码
        //解决方法可以用updated每次数据一变函数就会执行或者watch监听数据变化，数据变化也会重复执行，两种选择，watch比较针对性
        //也要加上 this.$nextTick，在修改数据之后使用它，然后等待dom更新
        // 数据->调用函数（等有数据后才调用函数）watch
        // 调用函数->初始化插件(等待dom更新才调用里面代码)this.$nextTick
        //两层
        // 之前没用this.$nextTick时因为之前不直接操作dom，操作dom的过程都由vue来解决，内部会解决这个问题
        // 但是引入jquery插件，要手动操作dom了，就需要这个函数，以后操作dom最好加上这个函数，要保证没有任何问题
        //
            imglist() {
              this.$nextTick(function () {
                console.log("-------------------------------------");
                    console.log($('.magnifier img'));
                    console.log("-----------------");
                    console.log(this.imglist);
                    var _magnifier = $().imgzoon({
                        magnifier : "#magnifier1",//最外层的大容器
                        width : 370,//承载容器宽
                        height : 370,//承载容器高
                        moveWidth : null,//如果设置了移动盒子的宽度，则不计算缩放比例
                        zoom : 5//缩放比例
                    });
                });
            }
        }
    };
</script>

<style scoped lang="less">
    @import '../../../../../lib/imgzoom/css/magnifier.css';
</style>
