'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
var port = 2345;
var host = '127.0.0.1';


function highlight(file,ext,response){
    file = file.replace(/</g, '&lt;');
    file = file.replace(/>/g, '&gt;');
    file = '<pre> <code class=' + "'" +ext + "'" + '>' + file + '</code></pre>';
    var home = fs.readFileSync ('home.html').toString();
    home = home.replace('content', file);
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(home);
    console.log(home+ "----------------");
    response.end();
}

function readFileonLocal(path)
{
    var result = fs.readFileSync(path).toString();
    return result;
}
function getFile(response,path)
{
    var extension = path.split('.').pop();
    var pathFile = '.' + path;
    var contentType;
    switch (extension)
    {
        case 'js':
            contentType = 'text/javascript';
            var file = readFileonLocal(pathFile);
            file = highlight(file,extension,response);
            break;
        case 'html':
            contentType = 'text/html';
            var file = readFileonLocal(pathFile);
            file = highlight(file,extension,response);
            break;
        case 'jpeg':
            contentType = 'image/jpeg';
            response.writeHead(200, {'Content-Type': contentType});
            var stream = fs.createReadStream ('.' + path);
            console.log(file);
            stream.on('open',function(){
                stream.pipe(response);
            });

            stream.on('error',function(err){
                console.log("Error at: " + __dirname + path);
                response.end(err);
            });
            break;
        case 'jpg':
            contentType = 'image/jpg';
            response.writeHead(200, {'Content-Type': contentType});
            var stream = fs.createReadStream ('.' + path);
            console.log(file);
            stream.on('open',function(){
                stream.pipe(response);
            });

            stream.on('error',function(err){
                console.log("Error at: " + __dirname + path);
                response.end(err);
            });
            break;
        case 'png':
            contentType = 'image/png';
            response.writeHead(200, {'Content-Type': contentType});
            var stream = fs.createReadStream ('.' + path);
            console.log(file);
            stream.on('open',function(){
                stream.pipe(response);
            });

            stream.on('error',function(err){
                console.log("Error at: " + __dirname + path);
                response.end(err);
            });
            break;
        case 'css':
            contentType = 'text/css';
            var file = readFileonLocal(pathFile);
            file = highlight(file,extension,response);
            break;
        default :
            contentType = 'unknow';
            response.end();
            return;
    }


}

function getRequest(response,url_parsed)
{
    var path = url_parsed.pathname;

    switch (path)
    {
        case "/":
            response.writeHead(200,{'Content-Type': 'text/html'});

            fs.readdir('.', function(err,listFiles){

               for(var i = 0 ; i < listFiles.length; i++)
               {
                       response.write('<a href="/' + listFiles[i] + '">' + listFiles[i] + '</a></br>');
               }
                response.end();
            });
            break;
        default :
            if(path.includes('.'))
            {
                getFile(response,path);
            }
            break;
    }
}

const server = http.createServer();
//on : hứng sự kiện request đến. Khi có yêu cầu mới truyền vào 1 callback function.
server.on('request',function(request,response) {

    var url_parsed = url.parse(request.url,true);
    //response.writeHead(200,{'Content-type':'text/plain'});
    //response.write("URL: " + url_parsed.pathname);
    //console.log(request.method);
    //response.end("Request: " +  request);
    if(request.method === "GET")
    {
        console.log(url_parsed.pathname);
        getRequest(response,url_parsed);
    }

});

server.listen(port,host,function(){
    var address = server.address();
    console.log("Server run: " , address);
});