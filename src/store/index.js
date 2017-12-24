import Vue from 'vue';

export default {
    state: {
        // 存储购物车商品购买记录, 初始化值应该从本地localStorage里面取, 没有则为空对象
        shopcartData: JSON.parse(localStorage.getItem('shopcartData')) || {},
        // 在vue里面必须要在data里面预定义属性，要是不预定义的话，后续修改的东西视图是不会刷新的。自己手动新增一个数据没有预定义，后来改了视图不会刷新
        // 不预定义字段属性，但是后续手动新增字段:值一个数据进去，再做修改，视图就不会刷新，对一维列表可以，二维不能新增
        // 解决方法:
        // 1.先预定义字段属性，定义字段名：空值
        // 2.不预定义字段属性，但是后续会整体赋一个新的对象到当前对象，再做修改，这样一开始留空也是没问题的（重要的是一维列表已经初始化shopcartData:{}，在字段名确定的情况下，只调用一次初始化请求接口获取一个对象包含整体的数据只执行一次)）
        // 3.局部新增，动态字段，不预定义字段属性，但是后续会新增一个个属性到当前对象，再做修改，因为vue不能检测属性被添加，调用时用set方法add->update->update
        // （在字段名不能写死，而且数量和值不能确定的情况下，如果多次获取一个对象，而对象只包含某一个局部数据，每次赋值会造成整体替换，现在只需要对一个局部数据进行操作，对于局部新增得东西,vue无法检测数据得变化，一新增视图不会发生变化）
        
        //整体
        // shopcartData: JSON.parse(localStorage.getItem('shopcartData')) //不预定义字段属性，一维已经定义，一维可以赋值，vue视图正常刷新
        //局部
        // state.shopcartData[params.id] = params.val; //不预定义字段属性,对一个局部数据进行新增 vue的视图不会刷新，一维已经定义，一维可以赋值，但二维没定义，直接对二维新增再赋值，vue视图无法刷新
        //    Vue.set(state.shopcartData, params.id, params.val); //不预定义字段属性,使用内置set对一个局部数据进行新增（也有修改功能） vue的视图才能刷新 一维已经定义，一维可以赋值，但二维没定义，直接对二维新增用set方法（包含新增定义赋值或者修改赋值）vue视图可以刷新
        // shopcartData:{},/

    },

    // 获取状态, 记住以属性的方式使用
    getters: {
        // 取原值
        getShopcartData(state) {
            return state.shopcartData;
        },

        // 获取商品总数
        // 1 先取出所有商品的购买数量, 对象中每个元素的value即购买数量
        // 2 通过reduce方法把数量累加起来
        // 3 返回累加结果
        getShopcartTotal(state) {
            return Object.values(state.shopcartData).reduce((s, v) => s + v, 0);
        },

        // 获取所以的商品ID
        // 1 先取出所有商品的ID, 对象中每个元素的key即为商品ID
        // 2 通过join方法把所有ID通过 , 号连接成字符串
        // 3 返回字符串结果
        getShopcartIDS(state) {
            return Object.keys(state.shopcartData).join(',');
        }
    },

    // 修改状态, 记住要commit方法调用
    mutations: {
        // 添加或修改数据
        // 1 通过params.id得到要修改的商品ID, 
        // 2 然后通过这个ID直接赋值, 如果之前没有记录, 就是新增, 有就是修改
        // @params1 第一个参数固定为state
        // @params2 第二个参数为调用时传递过来的值
        // @params2 我们这里要求params为一个对象, 拥有id与val两个属性
        upShopcartData(state, params) {
            // 这样写, 对于新增的数据不能触发视图刷新
            // state.shopcartData[params.id] = params.val; 

            // 因为这里有可能是修改, 也有可能是新增, 为了保证让视图一定刷新, 所以改用Vue.set，直接修改不累加
            Vue.set(state.shopcartData, params.id, params.val);
            localStorage.setItem('shopcartData', JSON.stringify(state.shopcartData));
        },

        // 在原有的基础上累加购买数量
        // 1 先判断原先有没有该ID的购买记录
        // 2 如果有, 那么累加
        // 3 如果没有, 就直接赋值当做新增
        addShopcartData(state, params) {
            if(state.shopcartData[params.id]) {
                state.shopcartData[params.id] += params.val;//修改功能，set的修改功能无法累加，只能手动累加
            }else {
                // state.shopcartData[params.id] = params.val; 
                Vue.set(state.shopcartData, params.id, params.val);//新增，也包含修改功能
            }
            localStorage.setItem('shopcartData', JSON.stringify(state.shopcartData));
        },

        // 删除一条购买记录
        // 通过Vue提供的delete方法删除指定商品ID的数据
        delShopcartData(state, params) {
            Vue.delete(state.shopcartData, params.id);
            localStorage.setItem('shopcartData', JSON.stringify(state.shopcartData));
        }
    }
}
