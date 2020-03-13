//const  base_url = 'http://118.31.120.192:8087'
const base_url = process.env.BASE_API;


const config = {
  url: base_url,
  // 文件上传地址
  fileUrl: base_url + "/sysbase/confiles/upload",
   // 文件下载
   fileCmsUrl: base_url + "/sysbase/confiles/cms/download?filePath=",
}
export default config
