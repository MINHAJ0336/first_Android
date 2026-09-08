import React, { useState, useRef } from 'react';
import { useFamily } from '../context/FamilyContext';
import { GalleryPhoto } from '../types';
import { 
  Image as ImageIcon, 
  Upload, 
  Camera, 
  Heart, 
  MessageCircle, 
  Download, 
  X, 
  Send, 
  FolderHeart, 
  Sparkles,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GalleryView: React.FC = () => {
  const { 
    photos, 
    addPhoto, 
    togglePhotoLike, 
    addPhotoComment, 
    currentUser 
  } = useFamily();

  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [activePhotoModal, setActivePhotoModal] = useState<GalleryPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Upload form state
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadAlbum, setUploadAlbum] = useState('Family Dinners');
  const [commentInput, setCommentInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const albums = ['All', 'Eid 2026', 'Family Dinners', 'Vacations', 'Celebrations', 'Old Memories'];

  const filteredPhotos = selectedAlbum === 'All' 
    ? photos 
    : photos.filter(p => p.album === selectedAlbum);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;

    addPhoto({
      url: uploadUrl,
      caption: uploadCaption.trim() || 'New Family Moment ❤️',
      album: uploadAlbum,
      date: 'Just now',
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setUploadUrl('');
    setUploadCaption('');
    setShowUploadModal(false);
  };

  const handleAddComment = (e: React.FormEvent, photoId: string) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addPhotoComment(photoId, commentInput.trim());
    setCommentInput('');

    // Update activePhotoModal state so new comment appears immediately
    setActivePhotoModal(prev => {
      if (!prev || prev.id !== photoId) return prev;
      return {
        ...prev,
        comments: [
          ...prev.comments,
          {
            id: `c-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            text: commentInput.trim(),
            time: 'Just now'
          }
        ]
      };
    });
  };

  return (
    <div id="gallery-view-container" className="flex flex-col h-full bg-neutral-950 overflow-y-auto select-none">
      {/* Gallery Header */}
      <header className="bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 p-4 shrink-0 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-emerald-400" />
            Shared Family Album
          </h2>
          <p className="text-xs text-neutral-400">
            {photos.length} shared memories across the family
          </p>
        </div>

        <button
          id="btn-upload-photo-open"
          onClick={() => setShowUploadModal(true)}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </header>

      {/* Album Pills Filter */}
      <div id="gallery-albums-filter" className="bg-neutral-900/60 border-b border-neutral-800/60 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        {albums.map((album) => (
          <button
            key={album}
            id={`filter-album-${album.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedAlbum(album)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedAlbum === album
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Photos Masonry/Grid */}
      <div id="gallery-photo-grid" className="p-3 grid grid-cols-2 gap-2.5 flex-1">
        {filteredPhotos.map((photo) => {
          const isLikedByMe = photo.likes.includes(currentUser.id);

          return (
            <div
              key={photo.id}
              id={`photo-card-${photo.id}`}
              className="group relative bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-neutral-700 transition-all"
              onClick={() => setActivePhotoModal(photo)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-800">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-80" />

              {/* Album badge top left */}
              <span className="absolute top-2 left-2 bg-neutral-950/70 backdrop-blur-sm text-[9px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full border border-neutral-700">
                {photo.album}
              </span>

              {/* Bottom Card Content */}
              <div className="absolute bottom-2 inset-x-2 flex flex-col">
                <p className="text-xs font-semibold text-white truncate drop-shadow-sm">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-300">
                  <span className="truncate">by {photo.uploadedByName.split(' ')[0]}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <Heart className={`w-3 h-3 ${isLikedByMe ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                      {photo.likes.length}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3 text-neutral-400" />
                      {photo.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Add to Shared Gallery
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPhoto} className="space-y-3.5">
              {/* Photo Preview / Picker */}
              <div className="relative">
                {uploadUrl ? (
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-neutral-800 relative group">
                    <img src={uploadUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setUploadUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-neutral-950/80 text-rose-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-emerald-500 bg-neutral-800/50 flex flex-col items-center justify-center cursor-pointer p-4 text-center transition-colors"
                  >
                    <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                    <p className="text-xs font-semibold text-neutral-200">
                      Tap to select photo from device
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      JPG, PNG, WebP supported
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Or Preset Unsplash Image */}
              {!uploadUrl && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-[10px] text-neutral-500 shrink-0">Presets:</span>
                  {[
                    'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setUploadUrl(url)}
                      className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-700 hover:border-emerald-400"
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Memory Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delicious lunch with Dadi Jan ❤️"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Album Selection */}
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Select Album
                </label>
                <select
                  value={uploadAlbum}
                  onChange={(e) => setUploadAlbum(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {albums.filter(a => a !== 'All').map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadUrl}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Photo Details / Lightbox Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-md overflow-hidden">
          {/* Modal Header */}
          <div className="p-4 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <img
                src={activePhotoModal.uploadedByAvatar}
                alt={activePhotoModal.uploadedByName}
                className="w-9 h-9 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <p className="text-xs font-bold text-white">{activePhotoModal.uploadedByName}</p>
                <p className="text-[10px] text-neutral-400">{activePhotoModal.date} • {activePhotoModal.album}</p>
              </div>
            </div>

            <button
              onClick={() => setActivePhotoModal(null)}
              className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo Display */}
          <div className="flex-1 bg-black flex items-center justify-center p-2 relative overflow-hidden">
            <img
              src={activePhotoModal.url}
              alt={activePhotoModal.caption}
              className="max-h-[50vh] w-auto max-w-full object-contain rounded-xl"
            />
          </div>

          {/* Info & Comments Section */}
          <div className="bg-neutral-900 border-t border-neutral-800 p-4 max-h-[40vh] flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <p className="text-sm font-semibold text-neutral-100 flex-1 pr-2">
                {activePhotoModal.caption}
              </p>

              {/* Like Button */}
              <button
                onClick={() => togglePhotoLike(activePhotoModal.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95 ${
                  activePhotoModal.likes.includes(currentUser.id)
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${activePhotoModal.likes.includes(currentUser.id) ? 'fill-rose-500' : ''}`} />
                <span>{activePhotoModal.likes.length}</span>
              </button>
            </div>

            {/* Comments Stream */}
            <div className="flex-1 my-3 space-y-2.5 overflow-y-auto pr-1">
              {activePhotoModal.comments.length === 0 && (
                <p className="text-xs text-neutral-500 text-center py-2">
                  No comments yet. Write the first warm note!
                </p>
              )}
              {activePhotoModal.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="bg-neutral-800/80 px-3 py-1.5 rounded-xl flex-1 border border-neutral-700/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-[11px]">{c.userName}</span>
                      <span className="text-[9px] text-neutral-500">{c.time}</span>
                    </div>
                    <p className="text-neutral-200 mt-0.5 leading-tight">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={(e) => handleAddComment(e, activePhotoModal.id)} className="flex items-center gap-2 pt-2 border-t border-neutral-800">
              <input
                type="text"
                placeholder="Write a comment for the family..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2 bg-emerald-500 disabled:opacity-40 text-neutral-950 rounded-xl font-bold transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
