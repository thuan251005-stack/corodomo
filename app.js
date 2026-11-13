const $ = id => document.getElementById(id);
const STORE = "tiktok_growth_prototype_v1";
const today = new Date().toISOString().slice(0,10);
const seed = {
 account:{name:"Tài khoản của bạn",handle:"@your_account",bio:"Chủ đề nội dung của bạn"},
 videos:[
  {id:"v1",title:"3 mẹo học tập giúp tập trung hơn",topic:"Học tập",date:shift(-2),views:12400,likes:980,comments:76,shares:143,follows:92},
  {id:"v2",title:"Một ngày làm việc và học tập",topic:"Đời sống",date:shift(-5),views:8700,likes:610,comments:42,shares:80,follows:54},
  {id:"v3",title:"Thử thách 7 ngày thay đổi thói quen",topic:"Thử thách",date:shift(-8),views:22100,likes:1750,comments:190,shares:310,follows:188},
  {id:"v4",title:"Những ứng dụng miễn phí hữu ích",topic:"Công nghệ",date:shift(-11),views:15600,likes:1210,comments:88,shares:202,follows:126},
  {id:"v5",title:"Chuyện vui ở giảng đường",topic:"Giải trí",date:shift(-15),views:9300,likes:840,comments:110,shares:95,follows:61}
 ],
 plans:[
  {id:"p1",title:"Làm phần 2 của video có hiệu quả tốt",date:shift(1),status:"Ý tưởng",note:"Giữ phong cách mở đầu tương tự"},
  {id:"p2",title:"Video chia sẻ mẹo hữu ích",date:shift(3),status:"Đang chuẩn bị",note:"Chuẩn bị 3 ví dụ cụ thể"}
 ]
};
function shift(days){const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function load(){try{const x=JSON.parse(localStorage.getItem(STORE));if(x&&Array.isArray(x.videos)&&x.account)return x}catch(e){}return structuredClone(seed)}
let state=load();
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
const fmt=n=>Number(n||0).toLocaleString("vi-VN");
const pct=n=>`${(n*100).toFixed(2).replace(".",",")}%`;
const sum=(key,arr=state.videos)=>arr.reduce((a,v)=>a+Number(v[key]||0),0);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function engagement(v){return v.views?(v.likes+v.comments+v.shares)/v.views:0}
function filteredVideos(){let arr=[...state.videos],p=$("periodSelect")?.value||"all";if(p!=="all"){const cutoff=shift(-Number(p));arr=arr.filter(v=>v.date>=cutoff)}return arr}
function render(){
 $("sideAccount").textContent=state.account.handle||"@your_account";$("avatarInitial").textContent=(state.account.name||"T").trim().charAt(0).toUpperCase();
 $("todayLabel").textContent=new Date().toLocaleDateString("vi-VN",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"});
 renderDashboard();renderVideos();renderGrowth();renderPlans();renderAccount();
}
function renderDashboard(){
 const arr=filteredVideos(),views=arr.reduce((a,v)=>a+v.views,0),follows=arr.reduce((a,v)=>a+v.follows,0),inter=arr.reduce((a,v)=>a+v.likes+v.comments+v.shares,0);
 $("totalViews").textContent=fmt(views);$("totalFollows").textContent=fmt(follows);$("engagement").textContent=pct(views?inter/views:0);$("videoCount").textContent=fmt(arr.length);
 const sorted=[...state.videos].sort((a,b)=>b.date.localeCompare(a.date));
 $("recentVideos").innerHTML=sorted.slice(0,4).map(v=>`<tr><td><div class="video-name">${esc(v.title)}</div><span class="subline">${esc(v.topic||"Chưa phân loại")}</span></td><td>${dateFmt(v.date)}</td><td class="num">${fmt(v.views)}</td><td class="num">${fmt(v.likes)}</td><td class="num">${fmt(v.follows)}</td><td><button class="mini-btn" data-edit="${v.id}">Sửa</button></td></tr>`).join("")||emptyRow(6);
 const insights=[];
 if(arr.length){const top=[...arr].sort((a,b)=>b.views-a.views)[0];insights.push(["↗","Video có nhiều View nhất",`“${top.title}” đạt ${fmt(top.views)} lượt xem.`]);const best=[...arr].sort((a,b)=>engagement(b)-engagement(a))[0];insights.push(["♡","Tương tác nổi bật",`“${best.title}” có tỷ lệ tương tác ${pct(engagement(best))}.`]);const conv=[...arr].sort((a,b)=>(b.views?b.follows/b.views:0)-(a.views?a.follows/a.views:0))[0];insights.push(["＋","Chuyển đổi Follow tốt",`“${conv.title}” có tỷ lệ Follow/View ${pct(conv.views?conv.follows/conv.views:0)}.`])}
 $("insights").innerHTML=insights.map(x=>`<div class="insight"><span class="insight-icon">${x[0]}</span><div><b>${x[1]}</b><p>${esc(x[2])}</p></div></div>`).join("")||"Chưa có dữ liệu.";
 drawChart(arr);
}
function drawChart(arr){
 const c=$("performanceChart");if(!c)return;const rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=rect.width*dpr;c.height=245*dpr;const ctx=c.getContext("2d");ctx.scale(dpr,dpr);const w=rect.width,h=245,pad={l:42,r:12,t:15,b:30};ctx.clearRect(0,0,w,h);
 const data=[...arr].sort((a,b)=>a.date.localeCompare(b.date)).slice(-7);if(!data.length){ctx.fillStyle="#9298aa";ctx.fillText("Thêm video để xem biểu đồ",20,80);return}
 const max=Math.max(1,...data.map(v=>v.views));ctx.font="10px DM Sans";ctx.strokeStyle="#2b3040";ctx.fillStyle="#858b9c";ctx.lineWidth=1;
 for(let i=0;i<=4;i++){let y=pad.t+(h-pad.t-pad.b)*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(fmt(Math.round(max*(4-i)/4)),2,y+3)}
 const x=i=>pad.l+(w-pad.l-pad.r)*(data.length===1?.5:i/(data.length-1)),y=v=>pad.t+(h-pad.t-pad.b)*(1-v/max);
 [[ "views","#ff477e"],["follows","#4dd8d0"]].forEach(([key,color])=>{const scale=key==="follows"?Math.max(1,...data.map(v=>v.follows))*4:max;ctx.beginPath();data.forEach((v,i)=>i?ctx.lineTo(x(i),pad.t+(h-pad.t-pad.b)*(1-v[key]/scale)):ctx.moveTo(x(i),pad.t+(h-pad.t-pad.b)*(1-v[key]/scale)));ctx.strokeStyle=color;ctx.lineWidth=2.4;ctx.stroke();data.forEach((v,i)=>{ctx.beginPath();ctx.arc(x(i),pad.t+(h-pad.t-pad.b)*(1-v[key]/scale),3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()})});
 data.forEach((v,i)=>{ctx.fillStyle="#858b9c";ctx.textAlign="center";ctx.fillText(dateShort(v.date),x(i),h-8)});ctx.textAlign="left";
}
function renderVideos(){
 const q=($("videoSearch")?.value||"").toLowerCase(),sort=$("sortVideos")?.value||"date";let arr=state.videos.filter(v=>(v.title+" "+v.topic).toLowerCase().includes(q));
 arr.sort((a,b)=>sort==="views"?b.views-a.views:sort==="engagement"?engagement(b)-engagement(a):b.date.localeCompare(a.date));
 $("allVideos").innerHTML=arr.map(v=>`<tr><td><div class="video-name">${esc(v.title)}</div><span class="subline">${esc(v.topic||"Chưa phân loại")}</span></td><td>${dateFmt(v.date)}</td><td>${fmt(v.views)}</td><td>${fmt(v.likes)}</td><td>${fmt(v.comments)}</td><td>${fmt(v.shares)}</td><td>${fmt(v.follows)}</td><td><div class="row-actions"><button class="mini-btn" data-edit="${v.id}">Sửa</button><button class="mini-btn delete" data-delete="${v.id}">Xóa</button></div></td></tr>`).join("");
 $("emptyVideos").hidden=arr.length>0;
}
function renderGrowth(){
 const views=sum("views"),likes=sum("likes"),comments=sum("comments"),shares=sum("shares"),follows=sum("follows");
 $("likeRate").textContent=pct(views?likes/views:0);$("commentRate").textContent=pct(views?comments/views:0);$("shareRate").textContent=pct(views?shares/views:0);$("followRate").textContent=pct(views?follows/views:0);
 const top=[...state.videos].sort((a,b)=>b.views-a.views)[0];
 $("topVideo").innerHTML=top?`<b>${esc(top.title)}</b><strong>${fmt(top.views)} View</strong><small>${fmt(top.likes)} Like · ${fmt(top.comments)} bình luận · ${fmt(top.follows)} Follow mới ghi nhận</small>`:"Chưa có video.";
 const tips=[];if(top)tips.push(["✦","Nghiên cứu video hiệu quả",`Xem lại chủ đề, câu mở đầu và cách dựng của “${top.title}”. Thử phát triển một nội dung liên quan.`]);
 const best=[...state.videos].sort((a,b)=>engagement(b)-engagement(a))[0];if(best)tips.push(["♡","Nhân rộng tín hiệu tương tác",`Video “${best.title}” có tỷ lệ tương tác cao nhất (${pct(engagement(best))}). Kiểm tra yếu tố khiến khán giả phản hồi.`]);
 tips.push(["＋","Tối ưu chuyển đổi Follow","Nêu rõ giá trị người xem nhận được nếu theo dõi, chẳng hạn một series có chủ đề nhất quán."]);
 $("growthTips").innerHTML=tips.map(x=>`<div class="insight"><span class="insight-icon">${x[0]}</span><div><b>${x[1]}</b><p>${esc(x[2])}</p></div></div>`).join("");
 const sorted=[...state.videos].sort((a,b)=>engagement(b)-engagement(a)),max=Math.max(.0001,...sorted.map(engagement));
 $("comparison").innerHTML=sorted.map(v=>`<div class="compare-row"><span title="${esc(v.title)}">${esc(v.title.slice(0,18))}${v.title.length>18?"…":""}</span><div class="bar-track"><div class="bar-fill" style="width:${engagement(v)/max*100}%"></div></div><b>${pct(engagement(v))}</b></div>`).join("")||"Chưa có dữ liệu.";
}
function renderPlans(){
 const plans=[...state.plans].sort((a,b)=>a.date.localeCompare(b.date));
 $("planList").innerHTML=plans.map(p=>`<div class="plan-item"><div class="plan-date"><b>${new Date(p.date+"T12:00:00").getDate()}</b><small>${new Date(p.date+"T12:00:00").toLocaleDateString("vi-VN",{month:"short"})}</small></div><div class="plan-info"><b>${esc(p.title)}</b><p>${esc(p.note||"Không có ghi chú")}</p></div><span class="plan-status">${esc(p.status)}</span><button class="mini-btn delete" data-plan-delete="${p.id}">×</button></div>`).join("")||'<div class="empty-state">Chưa có kế hoạch. Hãy tạo kế hoạch đầu tiên.</div>';
}
function renderAccount(){$("accountName").value=state.account.name||"";$("accountHandle").value=state.account.handle||"";$("accountBio").value=state.account.bio||""}
function dateFmt(s){return s?new Date(s+"T12:00:00").toLocaleDateString("vi-VN"):"—"}function dateShort(s){return new Date(s+"T12:00:00").toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit"})}
function emptyRow(n){return `<tr><td colspan="${n}">Chưa có dữ liệu</td></tr>`}
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));const names={dashboard:"Tổng quan",videos:"Quản lý video",growth:"Phân tích tăng trưởng",ideas:"Ý tưởng nội dung",planner:"Lịch nội dung",settings:"Cài đặt"};$("pageTitle").textContent=names[page];$("crumb").textContent=names[page].toUpperCase();$("sidebar").classList.remove("open");if(page==="dashboard")drawChart(filteredVideos())}
document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.goto)));
$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");
$("periodSelect").onchange=renderDashboard;$("videoSearch").oninput=renderVideos;$("sortVideos").onchange=renderVideos;
function openVideo(v){$("videoModalTitle").textContent=v?"Sửa video":"Thêm video";$("videoId").value=v?.id||"";$("vTitle").value=v?.title||"";$("vTopic").value=v?.topic||"";$("vDate").value=v?.date||today;$("vViews").value=v?.views??0;$("vLikes").value=v?.likes??0;$("vComments").value=v?.comments??0;$("vShares").value=v?.shares??0;$("vFollows").value=v?.follows??0;$("videoModal").hidden=false}
function close(id){$(id).hidden=true}
$("quickAdd").onclick=$("addVideo").onclick=()=>openVideo(null);
$("videoForm").onsubmit=e=>{e.preventDefault();const id=$("videoId").value;const v={id:id||"v"+Date.now(),title:$("vTitle").value.trim(),topic:$("vTopic").value.trim(),date:$("vDate").value,views:+$("vViews").value,likes:+$("vLikes").value,comments:+$("vComments").value,shares:+$("vShares").value,follows:+$("vFollows").value};if(id)state.videos=state.videos.map(x=>x.id===id?v:x);else state.videos.push(v);save();render();close("videoModal");toast("Đã lưu video")};
$("addPlan").onclick=()=>{$("pDate").value=shift(1);$("planModal").hidden=false};
$("planForm").onsubmit=e=>{e.preventDefault();state.plans.push({id:"p"+Date.now(),title:$("pTitle").value.trim(),date:$("pDate").value,status:$("pStatus").value,note:$("pNote").value.trim()});save();renderPlans();close("planModal");e.target.reset();toast("Đã thêm kế hoạch")};
document.addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]"),pd=e.target.closest("[data-plan-delete]"),cl=e.target.closest("[data-close]");if(edit){const v=state.videos.find(x=>x.id===edit.dataset.edit);if(v)openVideo(v)}if(del&&confirm("Bạn có chắc muốn xóa video này?")){state.videos=state.videos.filter(x=>x.id!==del.dataset.delete);save();render();toast("Đã xóa video")}if(pd&&confirm("Xóa kế hoạch này?")){state.plans=state.plans.filter(x=>x.id!==pd.dataset.planDelete);save();renderPlans()}if(cl)close(cl.dataset.close)});
["videoModal","planModal"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target.id===id)close(id)}));
$("saveAccount").onclick=()=>{state.account={name:$("accountName").value.trim(),handle:$("accountHandle").value.trim()||"@your_account",bio:$("accountBio").value.trim()};save();render();toast("Đã lưu thông tin kênh")};
$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="tiktok-growth-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Đã xuất bản sao dữ liệu")};
$("importData").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const x=JSON.parse(await f.text());if(!Array.isArray(x.videos)||!x.account||!Array.isArray(x.plans))throw Error("Sai cấu trúc");state=x;save();render();toast("Đã nhập dữ liệu")}catch(err){alert("Không thể nhập file. Hãy chọn bản sao JSON được xuất từ TikTok Growth.")}e.target.value=""};
$("resetData").onclick=()=>{if(confirm("Khôi phục dữ liệu mẫu? Dữ liệu hiện tại sẽ bị thay thế.")){state=structuredClone(seed);save();render();toast("Đã khôi phục dữ liệu mẫu")}};
const templates=[
 ["Hook / câu hỏi","Bạn có từng gặp tình huống này khi {topic} không? Đây là điều mình ước biết sớm hơn.","Mở đầu bằng vấn đề quen thuộc, sau đó chia sẻ một giải pháp cụ thể."],
 ["Danh sách nhanh","3 điều hữu ích về {topic} mà người mới thường bỏ qua","Mỗi ý một cảnh ngắn, chữ trên màn hình rõ ràng."],
 ["Trước và sau","Mình đã thay đổi điều gì sau 7 ngày thử {topic}?","Cho thấy quá trình thật, kết quả và bài học."],
 ["Sai lầm phổ biến","Đừng mắc lỗi này nếu bạn đang tìm hiểu {topic}","Nêu một lỗi phổ biến, giải thích ngắn và đưa cách sửa."],
 ["Series nhiều phần","Bắt đầu series {topic}: phần 1 — điều cơ bản nhất","Kết thúc bằng lời hẹn phần tiếp theo có nội dung cụ thể."],
 ["Góc nhìn cá nhân","Một quan điểm của mình về {topic} có thể bạn chưa đồng ý","Nêu quan điểm có lý do, khuyến khích thảo luận lịch sự."]
];
function makeIdeas(){const topic=$("ideaTopic").value.trim()||"chủ đề của bạn",goal=$("ideaGoal").value;const goalText=goal==="views"?"Thu hút người xem mới":goal==="follows"?"Tạo lý do để theo dõi":"Khuyến khích phản hồi";$("ideaResults").innerHTML=templates.map((t,i)=>`<article class="idea-card"><span class="idea-tag">${goalText}</span><h4>${esc(t[1].replaceAll("{topic}",topic))}</h4><p>${esc(t[2])}</p><button class="mini-btn" data-copy="${i}">Sao chép ý tưởng</button></article>`).join("");}
$("generateIdeas").onclick=makeIdeas;makeIdeas();
document.addEventListener("click",async e=>{const b=e.target.closest("[data-copy]");if(b){const t=templates[+b.dataset.copy][1].replaceAll("{topic}",$("ideaTopic").value.trim()||"chủ đề của bạn");try{await navigator.clipboard.writeText(t);toast("Đã sao chép ý tưởng")}catch{toast(t)}}});
window.addEventListener("resize",()=>{if($("page-dashboard").classList.contains("active"))drawChart(filteredVideos())});
render();
