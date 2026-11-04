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
    const file={'/':'index.html','/index.html':'index.html','/favicon.svg':'favicon.svg'}[url.pathname];
    if(!file){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});return res.end(req.method==='HEAD'?undefined:'Not found');}
    try {
        const data=fs.readFileSync(path.join(root,file));
        const style=file==='index.html'?data.toString().match(/<style>([\s\S]*?)<\/style>/)?.[1]:null;
        const etag='"'+createHash('sha256').update(data).digest('hex')+'"';
        res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8');
        res.setHeader('Cache-Control','public, max-age=60, must-revalidate');
        res.setHeader('ETag',etag);
        res.setHeader('X-Content-Type-Options','nosniff');
        res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
        res.setHeader('Content-Security-Policy',`default-src 'none'; img-src 'self'; style-src ${style?"'sha256-"+createHash('sha256').update(style).digest('base64')+"'":"'none'"}; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`);
        if(req.headers['if-none-match']===etag){res.statusCode=304;return res.end();}
        res.setHeader('Content-Length',data.length);
        res.end(req.method==='HEAD'?undefined:data);
    } catch {res.writeHead(503,{'Content-Type':'text/plain'});res.end('Temporarily unavailable');}
});
server.requestTimeout=15000;
server.headersTimeout=10000;
server.listen(port,'127.0.0.1',()=>console.log(`Personal site listening at http://127.0.0.1:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),5000).unref();});
