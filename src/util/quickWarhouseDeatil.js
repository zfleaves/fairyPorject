export default class QuickWarehouse {
  constructor(item, typeMethod) {
    this.averagePrice = item.averagePrice;
    this.checkNum = item.checkNum;
    this.classifyCode = item.classifyCode;
    this.demType = item.demType;
    this.docCodeFrom = item.docCodeFrom;
    this.eId = item.eId;
    this.inCount = item.inCount;
    this.manufacturer = item.manufacturer;
    this.materialCode = item.materialCode;
    this.model = item.model;
    this.quality = item.quality;
    this[typeMethod] = item[typeMethod];
    this.ratePrice = item.ratePrice;
    this.remarks = item.remarks;
    this.taxRate = item.taxRate;
    this.totalPrice = item.totalPrice;

    // this.xxxx=item.xxxx;
  }
}
