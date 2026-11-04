import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Send, 
  ShieldCheck, 
  HelpCircle, 
  MapPin, 
  Search,
  CheckCircle,
  Share2
} from 'lucide-react';
import { ForumPost, InstitutionProfile } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/initialData';

interface CoordinationForumProps {
  institution: InstitutionProfile;
}

export const CoordinationForum: React.FC<CoordinationForumProps> = ({ institution }) => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  // New post form
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<ForumPost['category']>('تطبيق مناشير');

  // Active reply form
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const categories = [
    { id: 'all', label: 'كافة النقاشات المهنية' },
    { id: 'تطبيق مناشير', label: 'تطبيق المناشير المستحدثة' },
    { id: 'جداول توقيت', label: 'جداول التوقيت والتفويج' },
    { id: 'مجالس الأقسام', label: 'مجالس الأقسام والتوجيه' },
    { id: 'تنظيم امتحانات', label: 'الامتحانات الرسمية والحراسة' },
    { id: 'شؤون الأساتذة', label: 'شؤون الأساتذة والاستخلاف' },
  ];

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: `الناظر ${institution.directorOfStudies}`,
      wilaya: institution.wilaya,
      school: institution.schoolName,
      date: 'الآن',
      title: postTitle,
      content: postContent,
      category: postCategory,
      repliesCount: 0,
      likes: 1,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setIsNewPostOpen(false);
    setPostTitle('');
    setPostContent('');
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        const replies = p.replies || [];
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          replies: [
            ...replies,
            {
              author: `الناظر ${institution.directorOfStudies} (${institution.schoolName})`,
              date: 'الآن',
              text: replyText,
              isOfficialClarification: false
            }
          ]
        };
      }
      return p;
    }));

    setReplyText('');
    setActiveReplyPostId(null);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesCat;
    return matchesCat && (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term) ||
      post.wilaya.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-xl bg-[#091e14] border border-[#d4af37]/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>الركن الرابع: فضاء التوجيه والتنسيق المهني</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              فضاء تبادل الخبرات وتوحيد الرؤى بين النظار
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              منتدى تفاعلي معتمد يجمع نظار الثانويات ومديري الدراسات عبر كافة ولايات الوطن لطرح الإشكالات البيداغوجية، مناقشة المناشير المستحدثة، وتشارك الحلول الميدانية الناجعة.
            </p>
          </div>

          <button
            onClick={() => setIsNewPostOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>طرح إشكال أو استفسار مهني</span>
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 pt-4 border-t border-[#d4af37]/20">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#d4af37]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في نقاشات وتجارب النظار عبر الوطن..."
              className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#8f1414] to-[#600d0d] text-white border border-[#f5d77f]/50 shadow-md'
                  : 'bg-[#06150e] text-slate-300 hover:text-white border border-[#d4af37]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forum Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-[#091e14] border border-[#d4af37]/20 text-slate-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#d4af37]" />
            <p className="text-base font-semibold text-slate-300">لا توجد مناقشات في هذا التصنيف حالياً</p>
            <p className="text-xs mt-1">كن أول من يطرح إشكالاً أو يشارك تجربة بيداغوجية!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="rounded-xl bg-[#081a12] border border-[#d4af37]/30 p-5 shadow-lg space-y-4 hover:border-[#d4af37]/60 transition-all"
            >
              {/* Post Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d4af37]/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#105e32] border border-[#f5d77f]/40 flex items-center justify-center font-bold text-white text-xs">
                    {post.author.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{post.author}</span>
                      <span className="text-[10px] text-slate-400">· {post.school}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#d4af37]" />
                      <span>{post.wilaya}</span>
                      <span>· {post.date}</span>
                    </div>
                  </div>
                </div>

                <span className="self-start sm:self-center text-[10px] font-bold bg-[#8f1414]/70 text-white px-2.5 py-0.5 rounded border border-[#f5d77f]/40">
                  {post.category}
                </span>
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Post Replies Section */}
              {post.replies && post.replies.length > 0 && (
                <div className="p-3.5 rounded-lg bg-[#05140d] border border-[#d4af37]/20 space-y-3">
                  <div className="text-[11px] font-bold text-[#d4af37] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>الردود والتوضيحات الميدانية ({post.replies.length}):</span>
                  </div>

                  <div className="space-y-2">
                    {post.replies.map((rep, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg text-xs space-y-1 ${
                          rep.isOfficialClarification 
                            ? 'bg-[#0b2b1a] border border-[#d4af37]/40 shadow-sm' 
                            : 'bg-[#081a12] border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1">
                            {rep.isOfficialClarification && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                            )}
                            <span>{rep.author}</span>
                            {rep.isOfficialClarification && (
                              <span className="text-[9px] bg-[#8f1414] text-white px-1.5 py-0.2 rounded font-bold mr-1">
                                توضيح رسمي
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400">{rep.date}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{rep.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Box if active */}
              {activeReplyPostId === post.id && (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="اكتب ردك أو تجربتك لحل هذا الإشكال..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/30 text-xs text-white placeholder-slate-400 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                  />
                  <button
                    onClick={() => handleAddReply(post.id)}
                    className="px-3.5 py-2 rounded-lg bg-[#105e32] hover:bg-[#157841] text-[#f5d77f] font-bold text-xs flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>إرسال</span>
                  </button>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#d4af37]/10 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-[#d4af37] transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{post.likes} تأييد للحل</span>
                  </button>

                  <button
                    onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} تعليق وتجربة</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-400">
                  شبكة مديري الدراسات SNTE
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Post Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#081f14] border-2 border-[#d4af37] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
              <h3 className="font-bold text-white text-base">طرح إشكال مهني أو استفسار في فضاء النظار</h3>
              <button onClick={() => setIsNewPostOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">تصنيف الموضوع</label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as ForumPost['category'])}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                >
                  <option value="تطبيق مناشير">تطبيق المناشير المستحدثة</option>
                  <option value="جداول توقيت">جداول التوقيت والتفويج</option>
                  <option value="مجالس الأقسام">مجالس الأقسام والتوجيه</option>
                  <option value="تنظيم امتحانات">الامتحانات الرسمية والحراسة</option>
                  <option value="شؤون الأساتذة">شؤون الأساتذة والاستخلاف</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان الموضوع المقتضب</label>
                <input
                  type="text"
                  placeholder="مثال: إشكالية تطبيق تفويج حصة الإعلام الآلي في السنة الأولى..."
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">تفاصيل الإشكال أو المقترح</label>
                <textarea
                  rows={4}
                  placeholder="اشرح الإشكال البيداغوجي أو الإداري والمراجع المستند إليها وما تطلبه من آراء الزملاء النظار..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05140d] border border-[#d4af37]/40 text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-[#082014] font-bold"
                >
                  نشر الموضوع في فضاء النظار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
