const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
require('@next/env').loadEnvConfig(process.cwd());
const origin = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
(async () => {
 const response = await fetch(origin+'/rest/v1/product_images?select=storage_path&limit=1000', {headers:{apikey:key,Authorization:'Bearer '+key},signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error('Catalog read failed '+response.status);
 const rows=await response.json(); const map={}; let cursor=0, failed=0;
 await Promise.all(Array.from({length:4},async()=>{while(cursor<rows.length){const row=rows[cursor++];if(!row.storage_path)continue;const url=row.storage_path.startsWith('https://') ? row.storage_path : origin+'/storage/v1/object/public/product-images/'+row.storage_path;const hash=crypto.createHash('sha256').update(url).digest('hex').slice(0,20);try{const paths=[256,840].map(w=>'public/products/optimized/'+hash+'-'+w+'.webp');if(!paths.every(p=>fs.existsSync(p))){const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(r.status);const bytes=Buffer.from(await r.arrayBuffer());for(let i=0;i<2;i++)await sharp(bytes).rotate().resize({width:[256,840][i],withoutEnlargement:true}).webp({quality:82}).toFile(paths[i]);}map[url]=hash;}catch{failed++;}}}));
 fs.writeFileSync('data/optimizedProductImages.json',JSON.stringify(map,null,2)+'\n');console.log('Optimized:',Object.keys(map).length,'Failed:',failed);
})().catch(e=>{console.error(e.message);process.exitCode=1;});


