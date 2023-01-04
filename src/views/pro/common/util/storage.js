const APP_STOREAGE_PREX = 'TIBMS_'
function storage(){
    const store = localStorage

    /**
     * 存储KEY-VALUE
     * @param key
     * @param value
     * @param expire 单位秒
     */
    this.set = function (key,value,expire){
        const stringData = JSON.stringify({
            value,
            expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
        });
        store.setItem(getKey(key), stringData)
    }

    /**
     * 根据key 获取值
     * @param key
     * @returns {null|*}
     */
    this.get = function (key){
        const item = store.getItem(getKey(key))
        if (item) {
            try {
                const data = JSON.parse(item)
                const { value, expire } = data
                if (expire === null || expire >= new Date().getTime()) {
                    return value
                }
                this.remove(key)
            } catch (e) {
                return null
            }
        }
        return null
    }

  /**
   * 根据key获取值，如未过期会重新设置过期时间
   * @param key
   * @param expireNew 过期时间
   * @returns {null|*}
   */
    this.getUpdate = function (key,expireNew){
      const item = store.getItem(getKey(key))
      if (item) {
        try {
          const data = JSON.parse(item)
          const { value, expire } = data
          if (expire === null || expire >= new Date().getTime()) {
            // 更新过期时间
            this.set(key,value,expireNew)
            return value
          }
          this.remove(key)
        } catch (e) {
          return null
        }
      }
      return null
    }

    /**
     * 根据key删除
     * @param key
     */
    this.remove = function (key){
        store.removeItem(getKey(key))
    }

    /**
     * 清除所有存储
     */
    this.clear = function (){
        store.clear()
    }

    function getKey(key) {
        return `${APP_STOREAGE_PREX}${key}`.toUpperCase()
    }
}
// 返回实例
export default new storage()
