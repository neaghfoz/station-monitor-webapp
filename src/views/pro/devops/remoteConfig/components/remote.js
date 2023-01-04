import { exeCmd } from "../remoteConfigApi"

export default {
  async open( row,$this){
    const ip = row.serverIp
    const port = row.serverPort||9008
    // https://10.173.234.18:9008/vnc.html
    //const ip = '10.173.234.18'
   // const port = 9008
    row.loading = true
    const resp = await exeCmd({
      "cmd":"telnet",
      "cmdArgs": ip+" "+port
    })
    if(resp.success) {
      console.log(this)
      const data = resp.data
      console.log()
      if (!data.result) {
        $this.$message({
          message: `远程端口[${port}]无法连通，无法打开远程桌面`,
          type: 'warning'
        });
      } else {
        window.open(`https://${ip}:${port}/vnc.html`)
      }
    }
    row.loading = false
  }
}
