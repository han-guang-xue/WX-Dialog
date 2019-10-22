const app = getApp()

Page({
  getCurDomeDate:function(e){
    console.log(e)
    console.log("返回数据:" + e.detail)
  },
  getCurDomeDate1:function(e){
    console.log(e)
    e.detail.forEach(x=>{
      console.log("key:"+x.key+"; value:"+x.value);
    })
  }
})
