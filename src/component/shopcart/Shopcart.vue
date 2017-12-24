<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/cart.html">购物车</a>
            </div>
        </div>

        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <!--购物车头部-->
                    <div class="cart-head clearfix">
                        <h2>
                            <i class="iconfont icon-cart"></i>我的购物车</h2>
                        <div class="cart-setp">
                            <ul>
                                <li class="first active">
                                    <div class="progress">
                                        <span>1</span>
                                        放进购物车
                                    </div>
                                </li>
                                <li>
                                    <div class="progress">
                                        <span>2</span>
                                        填写订单信息
                                    </div>
                                </li>
                                <li class="last">
                                    <div class="progress">
                                        <span>3</span>
                                        支付/确认订单
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--购物车头部-->

                    <!--商品列表-->
                    <div class="cart-box">
                        <input id="jsondata" name="jsondata" type="hidden">
                        <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
                            <tbody>
                                <!-- 表头 -->
                                <tr>
                                    <th width="48" align="center">
                                        <!-- 
                                        1.在原生html中view的所有方法默认值event或者实参$event拿到得是事件对象，传参xx,xx($event)能取到事件对象。xx()，xx(a,b)取不到世界对象
                                        2.在vue里面inputNumber的Events
                                        事件名称	说明	回调参数
                                        change	绑定值被改变时触发	最后变更的值
                                        blur	在组件 Input 失去焦点时触发	(event: Event)
                                        focus	在组件 Input 获得焦点时触发	(event: Event)
                                        2.1 switch Events
                                        事件名称	说明	回调参数
                                        change	switch 状态发生变化时的回调函数	新状态的值 -->

                                        <!--思路，因为v-model无法绑定计算属性，计算属性只能使求值得出来的。原本可以全选<->控制列表开关数据计算属性<->列表开关
                                        虽然文档没有value属性，只要可以v-model的那就都有value属性,因为v-model操作的就是value属性
                                        单向绑定 数据改变控件 :value
                                        列表开关数据值->全选
                                        因为计算属性不能用双向，而单向绑定只能数据改变控件。实现控件改变数据只能用change绑定事件手动改数据
                                        全选->列表开关数据值->列表开关（列表开关双向绑定，数据影响控件）

                                        代替双向绑定v-model:用计算属性输出，然后事件改变计算属性，让两者分开，各管各，任何复杂问题都可以拆分一个个小单元
                                        -->

                                        <!-- <el-switch v-model="isSelectedAll" active-color="#13ce66"></el-switch> -->
                                        <!-- 设置value属性 -->
                                        <el-switch :value="allSwitchState" @change="switchAllChange" active-color="#13ce66"></el-switch>
                                    </th>
                                    <th align="left" colspan="2">商品信息</th>
                                    <th width="84" align="left">单价</th>
                                    <th width="104" align="center">数量</th>
                                    <th width="104" align="left">金额(元)</th>
                                    <th width="54" align="center">操作</th>
                                </tr>

                                <!-- 商品列表 -->
                                <tr v-for="item in goodsList" :key="item.id">
                                    <td width="48" align="center">
                                        <!--  -->
                                        <el-switch v-model="item.selected" active-color="#13ce66"></el-switch>
                                    </td>
                                    <td align="left" colspan="2">
                                        <img width="50" height="50" :src="item.img_url" alt="">
                                        <span>{{ item.title }}</span>
                                    </td>
                                    <td width="84" align="left">
                                        ￥{{ item.sell_price }}
                                    </td>
                                    <!-- change直接调用代码段 ，以前locastrong的值变为页面默认值，之前的值丢了，而且同步有问题，值少了1，-->
                                    <!-- 页面默认值是1，不应该一开始都是是1，而是应该从本地Locastrong（也就是全局）里面取 -->
                                    <!-- 原因页面默认值从后台取 后台查询接口返回的就是个0，不准确，而更新操作取值是取全局locastrong，而且更新操作是操作全局locastrong,因为没有更新购物车接口更新后台数据，这里用本地数据代替 -->
                                   <!-- 这里全局和本页面统一改为用locastrong取值，以后正式全局和本页面改为用接口查询，数据添加和修改调用接口 -->
                                    <!-- 统一用locastrong后:还是有问题之前的值丢了，而且页面和数据同步有问题，数据值少了1，第一次点击的时候页面数据刷新了加上1，但本地数据没变 -->
                                    <!-- 解决方法:因为模板里面v-model取值快已经拿到最新值,但是change直接使用的语句接收到的值延迟,使用change再回调里面接收到的item.buycount才是最新的值 -->
                                    <!-- 在回调里面接收最新的值，那一定准确，在change语句行写接收的值不准确 -->
                                    <!-- 第一次localstrong没加上，但v-model取值已经加了 -->
                                    <!-- input-number:Events
                                    事件名称	说明	回调参数
                                    change	绑定值被改变时触发	最后变更的值 -->
                                     <!-- <td width="104" align="center">
                                        <el-input-number v-model="item.buycount" @change="$store.commit('upShopcartData',{id:item.id,val:item.buycount})"
                                            size="mini" :min="1"></el-input-number>
                                    </td> -->
                                    <td width="104" align="center">
                                        <el-input-number v-model="item.buycount" @change="numberChange(item.id, $event)"
                                            size="mini" :min="1"></el-input-number>
                                    </td>
                                    <td width="104" align="left">
                                        ￥{{ item.sell_price * item.buycount }}</td>
                                    <td width="54" align="center">
                                        <el-button size="mini" @click.native="delGoods(item.id)">删除</el-button>
                                    </td>
                                </tr>

                                <!-- 没有商品的提示 -->
                                <tr v-if="!goodsList.length">
                                    <td colspan="10">
                                        <div class="msg-tips">
                                            <div class="icon warning">
                                                <i class="iconfont icon-tip"></i>
                                            </div>
                                            <div class="info">
                                                <strong>购物车没有商品！</strong>
                                                <p>您的购物车为空，
                                                    <a href="/index.html">马上去购物</a>吧！</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <!-- 勾选的总数与总价 -->
                                <tr>
                                    <th align="right" colspan="8">
                                        已选择商品
                                        <b class="red" id="totalQuantity">{{ selectedShopcartTotal }}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                                        <span class="red">￥</span>
                                        <b class="red" id="totalAmount">{{ selectedShopcartTotalPrice }}</b>元
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--/商品列表-->

                    <!--购物车底部-->
                    <div class="cart-foot clearfix">
                        <div class="right-box">
                            <button class="button" onclick="javascript:location.href='/index.html';">继续购物</button>
                            <button class="submit" onclick="formSubmit(this, '/', '/shopping.html');">立即结算</button>
                        </div>
                    </div>
                    <!--购物车底部-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                goodsList: []
            }
        },
        // 一个列表拿到一个值用:reduce
        // 参数	描述
        // function(total,currentValue, index,arr)	必需。用于执行每个数组元素的函数。
        // 函数参数:
        // 参数	描述
        // total	必需。初始值, 或者计算结束后的返回值。
        // currentValue	必需。当前元素
        // currentIndex	可选。当前元素的索引
        // arr	可选。当前元素所属的数组对象。
        // initialValue	可选。传递给函数的初始值
        computed: {
            // 选取的商品总数
            // 1 遍历商品列表
            // 2 找出selected为true的商品, 累加他们的购买数量
            selectedShopcartTotal() {
                return this.goodsList.reduce((s, v) => v.selected? s + v.buycount: s, 0);
            },

            // 选取的商品总价
            // 1 遍历商品列表
            // 2 找出selected为true的商品, 累加他们的单价 * 购买数量
            selectedShopcartTotalPrice() {
                return this.goodsList.reduce((s, v) => v.selected? s + v.sell_price * v.buycount: s, 0);
            },
           
            // var arr=[2,4,6];
            // arr.every(v=>v%2==0) 返回true 相当于arr.every(v=>{表达式值为true}})
           // var arr=[2,4,6，1];
            // arr.every(v=>v%2==0) 返回false 相当于arr.every(v=>{表达式值为false}})
            // 全选swtich的状态
            allSwitchState() {
                return this.goodsList.every(v => v.selected);
            }
        },
       
        methods: {
            // 全选awitch切换
            switchAllChange(bol) {
                this.goodsList.forEach(v => v.selected = bol);
            },

            // 通过IDS获取商品列表
            getGoodsList() {
                this.$http.get(this.$api.shopcartGoods + this.$store.getters.getShopcartIDS)
                    .then(rsp => {
                        rsp.data.message.forEach(goods => {
                            // 给请求回来的每个商品对象添加一个selected属性, 用于绑定Switch开关
                            goods.selected = true;
                            // 后台返回的就是个0，不准确，因为没有更新购物车接口更新后台数据，这里用本地数据代替
                            // 后台返回的buycount属性不正确, 我们给他修正一下
                            goods.buycount = this.$store.getters.getShopcartData[goods.id];
                        });
                        this.goodsList = rsp.data.message
                    });
            },

            // 数字输入框变化时执行该方法
            // 方法需要拿到商品ID与新的购买数值
            numberChange(id, val) {
                // upShopcartData使用直接修改，不是累加
                this.$store.commit('upShopcartData', { id: id, val: val });
            },

            // 删除商品
            // 1 从共享数据中删除, 这样本地storage与右上角购物车总数会跟着更新
            // 2 从当前组件的goodsList里面删除商品数据, 这样商品列表会跟着更新
            delGoods(id) {
                this.$store.commit('delShopcartData', { id: id });
                this.goodsList = this.goodsList.filter(v => v.id != id); // 留下不删除的商品
            }
        },

        created() {
            this.getGoodsList();
        }
    };
</script>

<style scoped>

</style>