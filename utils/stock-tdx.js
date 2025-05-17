class MajorIndicator {
  static calculateCross(data) {
    const len = data.length;
    if (len === 0) return [];
    
    const result = new Array(len);
    const WY1002 = new Float64Array(len);
    const WY1003 = new Float64Array(len);
    const WY1004 = new Float64Array(len);
    const XYS0Values = new Float64Array(len);
    const XYS1Values = new Float64Array(len);
    
    // 初始化首日数据
    const firstClose = data[0].close;
    WY1002[0] = firstClose;
    WY1003[0] = firstClose;
    WY1004[0] = firstClose;
    XYS0Values[0] = 0;
    XYS1Values[0] = 0;
    
    const ema4 = (prev, curr) => curr * 0.4 + prev * 0.6;
    // const ema13 = (prev, curr) => curr * (2/14) + prev * (12/14);
    
    for (let i = 1; i < len; i++) {
      const { close, volume, turnover, capital } = data[i];
      
      // 计算WY系列EMA（使用TypedArray提升性能）
      WY1002[i] = ema4(WY1002[i-1], close);
      WY1003[i] = ema4(WY1003[i-1], WY1002[i]);
      WY1004[i] = ema4(WY1004[i-1], WY1003[i]);
      
      // 计算XYS0
      const refWY = WY1004[i-1];
      XYS0Values[i] = refWY !== 0 ? ((WY1004[i] - refWY) / refWY) * 100 : 0;
      
      // 计算XYS1（2日MA）
      XYS1Values[i] = (XYS0Values[i-1] + XYS0Values[i]) / 2;
      
      // 存储结果（仅保留金叉计算所需的核心字段）
      result[i] = {
        XYS0: XYS0Values[i],
        XYS1: XYS1Values[i],
      };
    }
    
    return result;
  }

  static calculateMA(values, idx, period) {
    if (idx < period - 1) {
      let sum = 0;
      for (let i = 0; i <= idx; i++) sum += values[i];
      return sum / (idx + 1);
    }
    let sum = 0;
    for (let i = idx - period + 1; i <= idx; i++) sum += values[i];
    return sum / period;
  }

  static result(data) {
    const indicators = this.calculateCross(data);
    const len = indicators.length;
    if (len === 0) return 0;
    
    const last = indicators[len - 1];
    if (last.XYS0 < last.XYS1) return 0; // 最后一天不满足
    
    // 快速向前查找（使用反向循环+早期退出）
    for (let i = len - 1; ; i--) {
      if (i === 0) return len; // 从未出现XYS0 < XYS1的情况
      if (indicators[i-1].XYS0 < indicators[i-1].XYS1) {
        return len - 1 - (i - 1); // 计算间隔天数
      }
      if (i === 1 && indicators[0].XYS0 >= indicators[0].XYS1) {
        return len; // 仅首日不满足
      }
    }
  }
}
exports.MajorIndicator = MajorIndicator;
