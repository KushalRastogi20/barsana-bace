"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";

interface Folder { _id: string; name: string; description: string; slug: string; emoji: string; color: string; tag: string; mediaCount: number; isPublished: boolean; }

const EMOJI_OPTIONS = ["🪷","🌸","🌺","🌟","🎶","🎪","⛰️","🕌","🌅","🙏","🦚","✨"];
const COLOR_OPTIONS  = ["#e8a900","#2196b3","#e91e8c","#9b59b6","#27ae60","#e74c3c","#ff8c00","#5bbdd4"];
const DEFAULT_FORM   = { name:"", description:"", emoji:"🪷", color:"#e8a900", tag:"" };

export default function AdminFoldersPage() {
  const [folders, setFolders]       = useState<Folder[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Folder | null>(null);
  const [form, setForm]             = useState(DEFAULT_FORM);
  const [saving, setSaving]         = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast]           = useState<{msg:string;type:"success"|"error"}|null>(null);

  const showToast = (msg: string, type: "success"|"error" = "success") => {
    setToast({msg,type}); setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try { const {data} = await axios.get("/api/admin/folders"); setFolders(data); }
    catch { showToast("Failed to load","error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(DEFAULT_FORM); setEditing(null); setShowModal(true); };
  const openEdit   = (f: Folder) => { setForm({name:f.name,description:f.description,emoji:f.emoji,color:f.color,tag:f.tag}); setEditing(f); setShowModal(true); };

  const save = async () => {
    if (!form.name.trim()) return showToast("Name required","error");
    setSaving(true);
    try {
      editing ? await axios.patch(`/api/admin/folders/${editing._id}`,form) : await axios.post("/api/admin/folders",form);
      showToast(editing?"Updated ✓":"Created ✓"); setShowModal(false); load();
    } catch(err:any) { showToast(err?.response?.data?.error??"Save failed","error"); }
    finally { setSaving(false); }
  };

  const togglePublish = async (f: Folder) => {
    try { await axios.patch(`/api/admin/folders/${f._id}`,{isPublished:!f.isPublished}); showToast(f.isPublished?"Unpublished":"Published ✓"); load(); }
    catch { showToast("Failed","error"); }
  };

  const del = async (f: Folder) => {
    if (!confirm(`Delete "${f.name}" and ALL its media?`)) return;
    setDeletingId(f._id);
    try { await axios.delete(`/api/admin/folders/${f._id}`); showToast("Deleted"); load(); }
    catch { showToast("Delete failed","error"); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="flex min-h-screen" style={{background:"var(--cream)"}}>
      <AdminNav />

      {/* Same offset strategy as Dashboard */}
      <main className="flex-1 lg:ml-56 p-4 sm:p-6 md:p-8 lg:p-10 pb-24 md:pb-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 md:pl-0 pl-0 pt-2 md:pt-0">
          <div className="md:pl-12 lg:pl-0">
            <span className="section-label" style={{color:"rgba(58,46,26,.38)",fontSize:".52rem"}}>Admin</span>
            <h1 className="font-cinzel font-bold title-gold" style={{fontSize:"clamp(1.1rem,2.5vw,1.8rem)"}}>📂 Gallery Folders</h1>
          </div>
          <button onClick={openCreate} className="cta-btn px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-bold whitespace-nowrap">
            + New Folder
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl animate-float inline-block">🪷</div>
            <p className="font-fell italic mt-3 text-sm" style={{color:"rgba(58,46,26,.45)"}}>Loading…</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📂</div>
            <p className="font-fell italic text-lg mb-4" style={{color:"rgba(58,46,26,.45)"}}>No folders yet.</p>
            <button onClick={openCreate} className="cta-btn px-8 py-3 text-xs font-bold">✦ Create First Folder ✦</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {folders.map((f) => (
              <div key={f._id} className="admin-card overflow-hidden" style={{opacity:deletingId===f._id?0.5:1}}>
                <div style={{height:4,background:`linear-gradient(90deg,${f.color},${f.color}66)`}}/>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0">{f.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="font-cinzel-reg font-bold text-sm truncate" style={{color:"var(--ink)"}}>{f.name}</h3>
                        <p className="font-fell italic text-xs truncate" style={{color:"rgba(58,46,26,.42)"}}>/{f.slug}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-cinzel-reg shrink-0" style={{fontSize:".5rem",background:f.isPublished?"rgba(39,174,96,.12)":"rgba(150,150,150,.1)",color:f.isPublished?"#27ae60":"#888",border:`1px solid ${f.isPublished?"rgba(39,174,96,.3)":"rgba(150,150,150,.2)"}`}}>
                      {f.isPublished?"Published":"Draft"}
                    </span>
                  </div>

                  {f.description && (
                    <p className="font-fell italic text-xs mb-3" style={{color:"rgba(58,46,26,.48)"}}>{f.description}</p>
                  )}

                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="font-cinzel-reg text-xs font-bold" style={{color:f.color}}>{f.mediaCount} items</span>
                    {f.tag && (
                      <span className="px-2 py-0.5 rounded-full font-cinzel-reg" style={{fontSize:".5rem",background:"rgba(160,110,0,.08)",color:"var(--gold-dark)",border:"1px solid rgba(160,110,0,.2)"}}>
                        {f.tag}
                      </span>
                    )}
                  </div>

                  {/* Action buttons — stack nicely on small cards */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={()=>openEdit(f)} className="flex-1 py-2 rounded-xl font-cinzel-reg text-xs border transition-colors" style={{background:"rgba(160,110,0,.06)",borderColor:"rgba(160,110,0,.2)",color:"var(--gold-dark)",minWidth:"4rem"}}>
                      ✏️ Edit
                    </button>
                    <button onClick={()=>togglePublish(f)} className="flex-1 py-2 rounded-xl font-cinzel-reg text-xs border transition-colors" style={{background:f.isPublished?"rgba(231,76,60,.06)":"rgba(39,174,96,.06)",borderColor:f.isPublished?"rgba(231,76,60,.2)":"rgba(39,174,96,.2)",color:f.isPublished?"#e74c3c":"#27ae60",minWidth:"4.5rem"}}>
                      {f.isPublished?"Unpublish":"Publish"}
                    </button>
                    <Link href={`/folders/${f.slug}`} target="_blank" className="px-3 py-2 rounded-xl font-cinzel-reg text-xs border transition-colors" style={{background:"rgba(33,150,179,.06)",borderColor:"rgba(33,150,179,.2)",color:"#0d7a99",textDecoration:"none"}}>
                      🔗
                    </Link>
                    <button onClick={()=>del(f)} disabled={!!deletingId} className="px-3 py-2 rounded-xl text-xs border transition-colors" style={{background:"rgba(231,76,60,.06)",borderColor:"rgba(231,76,60,.15)",color:"#c0392b"}}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4"
          style={{background:"rgba(58,46,26,.5)",backdropFilter:"blur(4px)"}}
          onClick={()=>setShowModal(false)}
        >
          <div
            className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-h-[92dvh] overflow-y-auto"
            style={{background:"#fffdf5",border:"2px solid rgba(160,110,0,.3)"}}
            onClick={e=>e.stopPropagation()}
          >
            <h2 className="font-cinzel-reg font-bold mb-5 text-base" style={{color:"var(--ink)"}}>
              {editing?"✏️ Edit Folder":"📂 New Folder"}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="section-label" style={{fontSize:".54rem"}}>Folder Name *</label>
                <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="admin-input" placeholder="e.g. Janmashtami 2024"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="section-label" style={{fontSize:".54rem"}}>Description</label>
                <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2} className="admin-input resize-none" placeholder="Brief description…"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="section-label" style={{fontSize:".54rem"}}>Tag</label>
                <input value={form.tag} onChange={e=>setForm(p=>({...p,tag:e.target.value}))} className="admin-input" placeholder="e.g. Annual Festival"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="section-label" style={{fontSize:".54rem"}}>Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map(e=>(
                    <button key={e} onClick={()=>setForm(p=>({...p,emoji:e}))} className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all"
                      style={{background:form.emoji===e?"rgba(160,110,0,.15)":"rgba(0,0,0,.04)",border:form.emoji===e?"2px solid rgba(160,110,0,.5)":"1px solid rgba(0,0,0,.1)"}}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="section-label" style={{fontSize:".54rem"}}>Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(c=>(
                    <button key={c} onClick={()=>setForm(p=>({...p,color:c}))} className="w-7 h-7 rounded-full transition-all"
                      style={{background:c,border:form.color===c?"3px solid #fff":"2px solid rgba(255,255,255,.3)",boxShadow:form.color===c?`0 0 8px ${c}`:"none"}}/>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={()=>setShowModal(false)} className="flex-1 py-2.5 rounded-xl font-fell italic text-sm border transition-colors" style={{color:"rgba(58,46,26,.55)",borderColor:"rgba(160,110,0,.2)"}}>
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="flex-1 cta-btn py-2.5 text-xs font-bold" style={{opacity:saving?0.6:1}}>
                {saving?"Saving…":editing?"✓ Update":"✦ Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-24 md:bottom-6 right-4 sm:right-6 z-[9999] px-5 py-3 rounded-xl font-fell italic text-sm shadow-xl text-white"
          style={{background:toast.type==="success"?"rgba(39,174,96,.92)":"rgba(192,57,43,.92)",backdropFilter:"blur(6px)"}}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}