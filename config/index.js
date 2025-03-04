class Config {
  constructor() {
    this.config = {};
  }
  async init() {
    this.config = await FILE_READ("config/index.json");
    return this
  }
  get(key) {
    return this.config[key];
  }
  async set(key,val) {
    this.config[key] = val;
    await FILE_CACHE("config/index.json",JSON.stringify(this.config));
  }
}

module.exports = new Config();
