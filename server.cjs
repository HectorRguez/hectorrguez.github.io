const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {createHash}=require('node:crypto');
const root=path.join(__dirname,'public');
const port=Number(process.env.PORT || 3211);
const server=http.createServer((req,res)=>{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/healthz'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(req.method==='HEAD'?undefined:'{"status":"ok"}');}
    if(url.pathname==='/cv'){res.writeHead(301,{'Location':url.pathname+'/'});return res.end();}
    const file={'/':'index.html','/index.html':'index.html','/favicon.svg':'favicon.svg','/cv/':'cv/index.html','/photo.jpg':'photo.jpg','/Hector-Rodriguez-Rodriguez-CV.pdf':'Hector-Rodriguez-Rodriguez-CV.pdf','/fonts/geist-mono-400.woff2':'fonts/geist-mono-400.woff2','/fonts/geist-mono-600.woff2':'fonts/geist-mono-600.woff2','/fonts/OFL.txt':'fonts/OFL.txt'}[url.pathname];
    if(!file){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end(req.method==='HEAD'?undefined:'Not found');}
    try {
        const data=fs.readFileSync(path.join(root,file));
        const style=file.endsWith('.html')?data.toString().match(/<style>([\s\S]*?)<\/style>/)?.[1]:null;
        const etag='"'+createHash('sha256').update(data).digest('hex')+'"';
        res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':file.endsWith('.jpg')?'image/jpeg':file.endsWith('.pdf')?'application/pdf':file.endsWith('.woff2')?'font/woff2':file.endsWith('.txt')?'text/plain; charset=utf-8':'text/html; charset=utf-8');
        res.setHeader('Cache-Control','public, max-age=60, must-revalidate');
        res.setHeader('ETag',etag);
        res.setHeader('X-Content-Type-Options','nosniff');
        res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
        res.setHeader('Content-Security-Policy',`default-src 'none'; img-src 'self'; font-src 'self'; style-src ${style?"'sha256-"+createHash('sha256').update(style).digest('base64')+"'":"'none'"}; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`);
        if(req.headers['if-none-match']===etag){res.statusCode=304;return res.end();}
        res.setHeader('Content-Length',data.length);
        res.end(req.method==='HEAD'?undefined:data);
    } catch {res.writeHead(503,{'Content-Type':'text/plain'});res.end('Temporarily unavailable');}
});
server.requestTimeout=15000;
server.headersTimeout=10000;
server.listen(port,'127.0.0.1',()=>console.log(`Personal site listening at http://127.0.0.1:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),5000).unref();});
