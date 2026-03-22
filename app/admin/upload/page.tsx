"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import AdminNav from "@/components/admin/AdminNav";

interface Folder { _id: string; name: string; emoji: string; slug: string; color: string; }
interface UploadFile { file: File; preview: string; status: "pending"|"uploading"|"done"|"error"; error?: string; }

export default function AdminUploadPage() {
  const [folders, setFolders]           = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles]               = useState<UploadFile[]>([]);
  const [uploading, setUploading]       = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const [toast, setToast]               = useState<{msg:string;type:"success"|"error"}|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg:string, type:"success"|"error"="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  useEffect(() => { axios.get("/api/admin/folders").then(({data})=>setFolders(data)).catch(()=>{}); }, []);

  const addFiles = useCallback((incoming: FileList|File[]) => {
    const arr = Array.from(incoming);
    const valid = arr.filter(f=>f.type.startsWith("image/")||f.type.startsWith("video/"));
    if (valid.length!==arr.length) showToast("Some files skipped (images & videos only)","error");
    setFiles(p=>[...p,...valid.map(f=>({file:f,preview:URL.createObjectURL(f),status:"pending" as const}))]);
  }, []);

  const handleDrop = (e:React.DragEvent) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };
  const removeFile = (idx:number) => { setFiles(p=>{ URL.revokeObjectURL(p[idx].preview); return p.filter((_,i)=>i!==idx); }); };

  const handleUpload = async () => {
    if (!selectedFolder) return showToast("Select a folder first","error");
    const pending = files.filter(f=>f.status==="pending");
    if (!pending.length) return showToast("No files to upload","error");
    setUploading(true);
    for (let i=0;i<pending.length;i+=5) {
      const batch = pending.slice(i,i+5);
      const fd = new FormData();
      fd.append("folderId",selectedFolder);
      batch.forEach(uf=>fd.append("files",uf.file));
      setFiles(p=>p.map(f=>batch.some(b=>b.file===f.file)?{...f,status:"uploading"}:f));
      try {
        const {data} = await axios.post("/api/admin/upload",fd);
        setFiles(p=>p.map(uf=>{ const r=data.results.find((x:any)=>x.name===uf.file.name); if(!r)return uf; return r.success?{...uf,status:"done"}:{...uf,status:"error",error:r.error}; }));
      } catch { setFiles(p=>p.map(f=>batch.some(b=>b.file===f.file)?{...f,status:"error",error:"Upload failed"}:f)); }
    }
    setUploading(false); showToast("Upload complete ✓");
  };

  const clearDone = () => setFiles(p=>{ p.filter(f=>f.status==="done").forEach(f=>URL.revokeObjectURL(f.preview)); return p.filter(f=>f.status!=="done"); });

  const pendingCount = files.filter(f=>f.status==="pending").length;
  const doneCount    = files.filter(f=>f.status==="done").length;
  const errorCount   = files.filter(f=>f.status==="error").length;

  return (
    <div className="flex min-h-screen" style={{background:"var(--cream)"}}>
      <AdminNav/>
      <main className="flex-1 ml-56 p-6 md:p-10">
        <div className="mb-8">
          <span className="section-label" style={{color:"rgba(58,46,26,.38)",fontSize:".52rem"}}>Admin</span>
          <h1 className="font-cinzel font-bold title-gold" style={{fontSize:"clamp(1.2rem,2.5vw,1.8rem)"}}>⬆️ Upload Media</h1>
          <p className="font-fell italic mt-1" style={{fontSize:".88rem",color:"rgba(58,46,26,.48)"}}>Upload photos and videos to any gallery folder</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <div className="admin-card p-5">
              <span className="section-label mb-3" style={{fontSize:".54rem"}}>Destination Folder *</span>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mt-2">
                {folders.length===0 && <p className="font-fell italic text-xs" style={{color:"rgba(58,46,26,.4)"}}>No folders yet.</p>}
                {folders.map(f=>(
                  <button key={f._id} onClick={()=>setSelectedFolder(f._id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left border"
                    style={{background:selectedFolder===f._id?`${f.color}12`:"rgba(0,0,0,.02)",borderColor:selectedFolder===f._id?`${f.color}55`:"rgba(160,110,0,.15)",color:selectedFolder===f._id?f.color:"rgba(58,46,26,.65)"}}>
                    <span className="text-lg">{f.emoji}</span>
                    <span className="font-fell text-sm">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {files.length>0 && (
              <div className="admin-card p-5">
                <span className="section-label mb-3" style={{fontSize:".54rem"}}>Progress</span>
                {[["📋","Total",files.length,"#b07d00"],["⏳","Pending",pendingCount,"#b07d00"],["✅","Done",doneCount,"#27ae60"],["❌","Errors",errorCount,"#c0392b"]].map(([e,l,v,c])=>(
                  <div key={String(l)} className="flex justify-between items-center py-1">
                    <span className="font-fell italic text-xs" style={{color:"rgba(58,46,26,.55)"}}>{e} {l}</span>
                    <span className="font-cinzel-reg font-bold text-sm" style={{color:String(c)}}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button onClick={handleUpload} disabled={uploading||!selectedFolder||pendingCount===0}
                className="cta-btn w-full py-3 text-xs font-bold" style={{opacity:uploading||!selectedFolder||pendingCount===0?0.55:1}}>
                {uploading?`Uploading…`:`✦ Upload ${pendingCount||""} Files ✦`}
              </button>
              {doneCount>0 && (
                <button onClick={clearDone} className="w-full py-2.5 rounded-xl font-fell italic text-sm border transition-colors"
                  style={{color:"rgba(58,46,26,.55)",borderColor:"rgba(160,110,0,.18)"}}>
                  Clear completed ({doneCount})
                </button>
              )}
            </div>
          </div>

          {/* Drop zone + previews */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div
              className="rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
              style={{minHeight:190,border:dragOver?"2px dashed rgba(160,110,0,.7)":"2px dashed rgba(160,110,0,.3)",background:dragOver?"rgba(160,110,0,.05)":"rgba(0,0,0,.02)"}}
              onDragOver={e=>{e.preventDefault();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={handleDrop}
              onClick={()=>inputRef.current?.click()}
            >
              <div className="text-4xl mb-3" style={{animation:dragOver?"float 1s ease-in-out infinite":undefined}}>{dragOver?"🪷":"⬆️"}</div>
              <p className="font-cinzel-reg font-bold text-sm mb-1" style={{color:"rgba(58,46,26,.55)"}}>{dragOver?"Release to add":"Drag & drop files here"}</p>
              <p className="font-fell italic text-xs" style={{color:"rgba(58,46,26,.38)"}}>or click to browse · Images & Videos · Max 100MB</p>
              <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e=>e.target.files&&addFiles(e.target.files)}/>
            </div>

            {files.length>0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {files.map((uf,i)=>{
                  const isVid=uf.file.type.startsWith("video/");
                  const borderColors={pending:"rgba(160,110,0,.2)",uploading:"rgba(33,150,179,.5)",done:"rgba(39,174,96,.5)",error:"rgba(192,57,43,.5)"};
                  const overlayColors={uploading:"rgba(33,150,179,.35)",done:"rgba(39,174,96,.3)",error:"rgba(192,57,43,.35)",pending:""};
                  const icons={uploading:"⏳",done:"✅",error:"❌",pending:""};
                  return (
                    <div key={i} className="relative rounded-xl overflow-hidden group" style={{aspectRatio:"1/1",border:`1px solid ${borderColors[uf.status]}`,background:"var(--cream-dark)"}}>
                      {isVid?<video src={uf.preview} className="w-full h-full object-cover" muted/>:<img src={uf.preview} alt={uf.file.name} className="w-full h-full object-cover"/>}
                      {overlayColors[uf.status]&&<div className="absolute inset-0 flex items-center justify-center text-2xl" style={{background:overlayColors[uf.status]}}>{icons[uf.status]}</div>}
                      {uf.status==="pending"&&<button onClick={()=>removeFile(i)} className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white" style={{background:"rgba(192,57,43,.85)"}}>✕</button>}
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1" style={{background:"linear-gradient(0deg,rgba(58,46,26,.8),transparent)"}}>
                        <p className="font-fell truncate" style={{fontSize:".6rem",color:"rgba(253,246,227,.85)"}}>{uf.file.name}</p>
                        {uf.status==="error"&&uf.error&&<p className="truncate" style={{fontSize:".55rem",color:"#ffaaaa"}}>{uf.error}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {toast&&(
        <div className="fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl font-fell italic text-sm shadow-xl text-white"
          style={{background:toast.type==="success"?"rgba(39,174,96,.92)":"rgba(192,57,43,.92)",backdropFilter:"blur(6px)"}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
