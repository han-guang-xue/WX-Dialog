Component({
  properties: {
    type: String,
    methodSuccess: String,
    multiSelect: String,
    all: String,
    otherData: String,
    lableTitle: String,
    default_value: String,
    isFull: String
  },

  data: {
    dialogType: '',
    types: ['date', 'time', 'radio', 'singleRow'],
    success: '',
    title: null,
    defaultvalue: null,
    otherData: null,
    multi: 'N',
    btn: ["取消", "确认"],
    animation: '', //动画
    animation_maskLayer: '', //模态框颜色渐变
    height: null,
    full: false, //是否全屏
    isAll: true,
    selectAll: false,
    height1: 0,
    dataCollection: [{
      type: "date",
      years: [],
      months: [],
      days: [],
      value: [3, 1, 3],
      selectedDate: null
    }, {
      type: "time",
      datatype: null,
      value: null
    }, {
      type: "radio",
      datatype: []
    }, {
      type: "singleRow",
      datatype: null,
      value: [],
      selectedData: null,
    }]
  },

  methods: {
    _setInitDialogStatus: function (e) {
      wx.showLoading({
        title: '加载中',
      })
      e = e.currentTarget.dataset;
      let status = e.status,
        types = this.data.types,
        title = e.title;
      let full = e.full;
      full = full === "false" ? false : true;
      let type = e.type;
      let success = e.success;
      let defaultvalue = e.defaultvalue;
      defaultvalue = defaultvalue === undefined ? null : defaultvalue;
      /**初始化数据  日期, 高度固定 500rpx; full:false; */
      if (type === types[0]) {
        this._initData({
          dialogType: type,
          full: false,
          height: 500,
          success: success,
          defaultvalue: defaultvalue,
          title: title
        })
      } else if (type === types[1]) {

      } else if (type === types[2]) {
        this._initData({
          dialogType: type,
          full: false,
          height: wx.getSystemInfoSync().windowHeight,
          success: success,
          defaultvalue: defaultvalue,
          otherData: e.other,
          multi: e.multi === undefined ? "N" : e.multi,
          isAll: e.all === 'false' ? false : true,
          selectAll: false,
          title: title
        })
      } else if (type === types[3]) {
        this._initData({
          dialogType: type,
          full: false,
          height: 500,
          success: success,
          defaultvalue: defaultvalue,
          otherData: e.other,
          title: e.title === undefined ? '' : e.title,
          multi: e.multi === undefined ? "N" : e.multi,
          title: title
        })
      }
      this._initDataCollection();
      this._setAnimation(true);
    },

    /**动画展示 */
    _setAnimation: function (status) {
      let that = this,
        height = that.data.height;
      height = status ? -height : height
      setTimeout(function () {
        let animation1 = wx.createAnimation({
          duration: 300,
          delay: 10,
          timingFunction: 'ease-in-out'
        })
        let animation2 = wx.createAnimation({
          duration: 300,
          delay: 10,
          timingFunction: 'ease-in-out'
        })
        animation1.translate(0, height / 2).step();
        that._initData({ animation: animation1.export() })
        animation2.backgroundColor("#000000").step();
        that._initData({ animation_maskLayer: animation2.export() })
      }, 100)

    },
    _setDialogStatus: function (e) {
      var status = e.currentTarget.dataset.status,
        that = this,
        height = that.data.height;
      status = status === "false" ? false : true;
      let animation1 = wx.createAnimation({
        duration: 300,
        delay: 10,
        timingFunction: 'ease-in-out'
      })
      let animation2 = wx.createAnimation({
        duration: 300,
        delay: 10,
        timingFunction: 'ease-in-out'
      })
      height = status ? -height : height
      animation1.translate(0, height / 2).step();
      that._initData({ animation: animation1.export() });
      animation2.backgroundColor("#ffffff").step();
      that._initData({ animation_maskLayer: animation2.export() });
      setTimeout(function () { that._initData({ dialogType: "NO" }) }, 200);
    },

    /** 根据类型初始化数据 */
    _initDataCollection: function () {
      var type = this.data.dialogType,
        types = this.data.types;
      let data = this.data.dataCollection,
        that = this,
        defaultvalue = this.data.defaultvalue;
      if (type === types[0]) {
        console.log("<========== date模态框 -> 初始化date数据 ==========>")
        let item = data[0]
        let date = new Date();
        item.value = [2, 1, 4];
        for (var i = date.getFullYear() - 100, j = 0; i < date.getFullYear() + 100; i++ , j++) {
          item.years.push(i);
          if (defaultvalue !== null && defaultvalue !== undefined && defaultvalue !== '') {
            let curyear = parseInt(defaultvalue.slice(0, 4));
            if (i === curyear) {
              item.value = [j, parseInt(defaultvalue.slice(5, 8)) - 1, parseInt(defaultvalue.slice(8, 12)) - 1];
              item.selectedDate = defaultvalue;
            }
          } else {
            if (i === date.getFullYear()) {
              let cmonth = date.getMonth() + 1;
              let cday = date.getDate();
              item.value = [j, cmonth - 1, cday - 1];
              item.selectedDate = i + "-" + (cmonth < 10 ? "0" + cmonth : cmonth) + "-" + (cday < 10 ? "0" + cday : cday);
            }
          }
        }
        for (var i = 0; i < 12; i++) { item.months.push(i + 1); }
        item.days = that._setDaysByYearAndMonth(date.getFullYear(), date.getMonth());
        that._initData({ dataCollection: data });
        setTimeout(function () {
          that._initData({ dataCollection: data })
        }, 5)
      } else if (type === types[1]) {
        var item = data[1];
      } else if (type === types[2]) {
        console.log("<========== radio模态框 -> 初始化radio数据 ==========>")
        let item = data[2];
        let data_type = that.data.otherData.split(",");
        var i = 0;
        item.datatype = [];
        data_type.forEach(x => {
          item.datatype.push({ key: i++, value: x, select: defaultvalue.split(",").indexOf(x) === -1 ? false : true })
        })
        this._initData({ dataCollection: data })
        this._isSelectAll();
      } else if (type === types[3]) {
        console.log("<========== singleRow模态框 -> 初始化radio数据 ==========>")
        let item = data[3];
        item.datatype = this.data.otherData.split(",");
        let i = 0;
        item.datatype.forEach(x => {
          if (x === defaultvalue) {
            item.value.push(i);
            item.selectedData = defaultvalue
          }
          i++;
        })
        that._initData({ dataCollection: data });
        setTimeout(function () {
          that._initData({ dataCollection: data })
        }, 100)
      }
      wx.hideLoading();
    },

    /** 日期监听事件 */
    _getSelectedDate: function (e) {
      const val = e.detail.value;
      let data = this.data.dataCollection;
      year = data[0].years[val[0]],
        month = data[0].months[val[1]],
        day = data[0].days[val[2]];
      data[0].selectedDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

      let date = new Date(year, month, 0);
      data[0].days = [];
      for (var i = 0; i < date.getDate(); i++) { data[0].days.push(i + 1) }
      data[0].value = [val[0], val[1], val[2] > data[0].days.length - 1 ? data[0].days.length - 1 : val[2]];
      this._initData({ dataCollection: data })
    },


    _setSelectAll: function (e) {
      this._initData({ selectAll: !this.data.selectAll });
      let that = this;
      this.data.dataCollection[2].datatype.forEach(item => {
        item.select = that.data.selectAll;
      })
      this._initData({ dataCollection: this.data.dataCollection })
    },
    /** 检测是否所有数据全选 */
    _isSelectAll: function () {
      var flag = true;
      this.data.dataCollection[2].datatype.forEach(item => {
        if (!item.select) flag = false
      })
      this._initData({ selectAll: flag })
    },
    /** 单个列表监听事件 */
    _getSelectedSingle: function (e) {
      const val = e.detail.value;
      let data = this.data.dataCollection;
      data[3].selectedData = data[3].datatype[val[0]];
      data[3].value = [val[0]];
      this._initData({ dataCollection: data });
    },

    /** 根据年月日 */
    _setDaysByYearAndMonth: function (year, month) {
      var date = new Date(year, month + 1, 0).getDate(),
        days = [];
      for (var i = 1; i <= date; i++) { days.push(i) }
      return days;
    },

    /** 返回数据 */
    _returnTrueData: function (e) {
      var data = this.data.dataCollection,
        that = this;
      var type = this.data.types[0];
      var eventPData = { month: 9 }
      data.forEach(item => {
        var eventPData = null;
        if (item.type === type) {
          eventPData = item.selectedDate;
          console.log("返回数据:" + eventPData);
          that.triggerEvent(this.data.success, eventPData);
          that._setDialogStatus(e);
          return;
        }

      })

    },

    /** 获取 */
    _setSelectedRadio: function (e) {
      var e1 = e.currentTarget.dataset;
      var index = parseInt(e1.index),
        isMulti = this.data.multi;
      var select = e1.select;
      if (isMulti === "Y") {
        this.data.dataCollection[2].datatype.forEach(item => {
          if (item.key === index) {
            item.select = !select;
          }
        })
        this._initData({ dataCollection: this.data.dataCollection })
      } else {
        let str = [];
        this.data.dataCollection[2].datatype.forEach(item => {
          if (item.key === index) {
            item.select = true;
            str.push({ key: item.key, value: item.value })
          } else {
            item.select = false;
          }
        })
        this._initData({ dataCollection: this.data.dataCollection })
        this.triggerEvent(this.data.success, str);
        let that = this;
        setTimeout(function () {
          that._setDialogStatus(e);
        }, 100)
      }
      this._isSelectAll();
    },


    _returnRadioTrueData: function (e) {
      var data = this.data.dataCollection[2].datatype;
      var str = [];
      data.forEach(item => {
        if (item.select) {
          str.push({ key: item.key, value: item.value })
        }
      });
      this.triggerEvent(this.data.success, str);
      this._setDialogStatus(e);
    },

    _returnTrueSingleData: function (e) {
      var data = this.data.dataCollection[3].selectedData;
      this.triggerEvent(this.data.success, data);
      this._setDialogStatus(e);
    },
    /**初始化数据 */
    _initData: function (data) {
      console.log(data);
      this.setData(data);
    }
  }


})