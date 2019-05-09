var fs = require("fs");
var http = require('http');

fs.readFile('./iconfont.css', 'utf-8', function (err, data) {
  if(err){
    return console.error(err)
  }

  // 匹配以‘icon-’开头，直到‘:’ 之前的字符串
  var patt = /icon-[\S^]*(?=\:)/ig;
  var iconList = data.match(patt);

  console.log(iconList.length)
  // 在一个文件中输入查看正则匹配结果
  fs.writeFile('./result.json', JSON.stringify(iconList, null, 4), 'utf8', (err) => {
      if( err ) {
          console.log( ' wrong: ', err);
          return false;
      } else {
          console.log('处理完成');
      }
  })

  // 生成html中的i标签
  var iconStr = '';
  for(var i = 0, len = iconList.length; i < len; i++) {
    iconStr += `<i class="iconfont ${iconList[i]}"></i> `
  }

  // 生成html
  http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type':'html'});
    response.write('<!DOCTYPE html>'+
                          '<html>'+
                          '<head>'+
                          '<meta charset="utf-8" />'+
                          '<title>兔子城堡</title>'+
                          '<style>'+ data +
                          '</style>'+
                          '</head>'+
                          `<body>${iconStr}</body>`+
                          '</html>')
    response.end();
  }).listen(8888)

  //  TODO 自动打开浏览器

  /* 
    获取本机ip
  */
 const ip = getIPAddress();
 console.log(`已运行${ip}:8888`)
 function getIPAddress(){
   var interfaces = require('os').networkInterfaces();
   for(var devName in interfaces) {
     var iface = interfaces[devName];
     for(var i = 0; i<iface.length; i++) {
       var alias = iface[i];
       if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
         return alias.address;
       }
     }
   }
 }
})