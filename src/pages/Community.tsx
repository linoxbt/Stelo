import { useState, useEffect, useCallback } from "react";
import { Users, MessageSquare, ExternalLink, Plus, Send, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWalletState } from "@/components/WalletButton";
import { useAccount } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ForumThread {
  id: string;
  wallet_address: string;
  title: string;
  body: string;
  category: string;
  is_pinned: boolean;
  replies_count: number;
  created_at: string;
  updated_at: string;
}

interface ForumReply {
  id: string;
  thread_id: string;
  wallet_address: string;
  body: string;
  created_at: string;
}

const CATEGORIES = ["general", "ideas", "feedback", "bug-report", "governance", "support"];

const socialLinks = [
  { label: "Discord", url: "#", icon: "💬", desc: "Join the Stelo community" },
  { label: "Telegram", url: "#", icon: "📱", desc: "Real-time updates & support" },
  { label: "Twitter / X", url: "#", icon: "🐦", desc: "Follow for announcements" },
  { label: "GitHub", url: "#", icon: "💻", desc: "Open-source contributions" },
];

function shortAddr(addr: string) {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Community() {
  const { connected } = useWalletState();
  const { address } = useAccount();
  const { toast } = useToast();

  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // New thread dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [creating, setCreating] = useState(false);

  // Filter
  const [filterCategory, setFilterCategory] = useState("all");

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("forum_threads")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (filterCategory !== "all") {
      query = query.eq("category", filterCategory);
    }

    const { data } = await query;
    if (data) setThreads(data as ForumThread[]);
    setLoading(false);
  }, [filterCategory]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const fetchReplies = useCallback(async (threadId: string) => {
    setRepliesLoading(true);
    const { data } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });
    if (data) setReplies(data as ForumReply[]);
    setRepliesLoading(false);
  }, []);

  const openThread = (thread: ForumThread) => {
    setSelectedThread(thread);
    setNewReply("");
    fetchReplies(thread.id);
  };

  const handleCreateThread = async () => {
    if (!address || !newTitle.trim() || !newBody.trim()) return;
    setCreating(true);

    const { data, error } = await supabase
      .from("forum_threads")
      .insert({
        wallet_address: address.toLowerCase(),
        title: newTitle.trim(),
        body: newBody.trim(),
        category: newCategory,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to create thread", variant: "destructive" });
    } else {
      toast({ title: "Thread created!", description: "Your discussion has been posted." });
      setCreateOpen(false);
      setNewTitle("");
      setNewBody("");
      setNewCategory("general");
      fetchThreads();
    }
    setCreating(false);
  };

  const handleSubmitReply = async () => {
    if (!address || !selectedThread || !newReply.trim()) return;
    setSubmittingReply(true);

    const { error } = await supabase
      .from("forum_replies")
      .insert({
        thread_id: selectedThread.id,
        wallet_address: address.toLowerCase(),
        body: newReply.trim(),
      });

    if (error) {
      toast({ title: "Error", description: "Failed to post reply", variant: "destructive" });
    } else {
      setNewReply("");
      fetchReplies(selectedThread.id);
      // Update local thread count
      setSelectedThread(prev => prev ? { ...prev, replies_count: prev.replies_count + 1 } : null);
    }
    setSubmittingReply(false);
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!address) return;
    const { error } = await supabase.from("forum_threads").delete().eq("id", threadId).eq("wallet_address", address.toLowerCase());
    if (!error) {
      setSelectedThread(null);
      fetchThreads();
      toast({ title: "Thread deleted" });
    }
  };

  // Thread Detail View
  if (selectedThread) {
    return (
      <DashboardLayout>
        <Button variant="ghost" size="sm" onClick={() => setSelectedThread(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Discussions
        </Button>

        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px]">{selectedThread.category}</Badge>
                  {selectedThread.is_pinned && <Badge className="text-[10px] bg-primary/10 text-primary">📌 Pinned</Badge>}
                </div>
                <h1 className="text-xl font-bold text-foreground">{selectedThread.title}</h1>
                <p className="text-xs text-muted-foreground mt-1">
                  by <span className="font-mono">{shortAddr(selectedThread.wallet_address)}</span> • {timeAgo(selectedThread.created_at)} • {selectedThread.replies_count} replies
                </p>
              </div>
              {address && selectedThread.wallet_address === address.toLowerCase() && (
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteThread(selectedThread.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedThread.body}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Replies ({selectedThread.replies_count})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {repliesLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : replies.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No replies yet. Be the first to respond!</p>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-foreground">{shortAddr(reply.wallet_address)}</span>
                    <span className="text-[10px] text-muted-foreground">{timeAgo(reply.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{reply.body}</p>
                </div>
              ))
            )}

            {connected && (
              <div className="flex gap-2 pt-4 border-t border-border">
                <Textarea
                  placeholder="Write a reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[60px] border-border bg-secondary"
                />
                <Button size="sm" disabled={!newReply.trim() || submittingReply} onClick={handleSubmitReply} className="shrink-0">
                  {submittingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Forum List View
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Community Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">Discuss ideas, share feedback, and shape the protocol's future.</p>
        </div>
        {connected && (
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Discussion
          </Button>
        )}
      </div>

      {/* Social links */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-6">
        {socialLinks.map((link) => (
          <Card key={link.label} className="border-border bg-card hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="flex items-center gap-3 p-3">
              <span className="text-xl">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground">{link.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{link.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", ...CATEGORIES].map((cat) => (
          <Button key={cat} variant={filterCategory === cat ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(cat)} className="capitalize text-xs">
            {cat === "all" ? "All" : cat.replace("-", " ")}
          </Button>
        ))}
      </div>

      {/* Threads */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <MessageSquare className="h-4 w-4" /> Discussions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : threads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-2">No discussions yet.</p>
              {connected && (
                <Button size="sm" onClick={() => setCreateOpen(true)}>Start the first discussion</Button>
              )}
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => openThread(thread)}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 hover:border-primary/20 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.is_pinned && <span className="text-[10px]">📌</span>}
                    <Badge variant="outline" className="text-[10px]">{thread.category}</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                  <p className="text-xs text-muted-foreground">
                    by {shortAddr(thread.wallet_address)} • {timeAgo(thread.created_at)} • {thread.replies_count} replies
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Create Thread Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">New Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Category</label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="border-border bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat.replace("-", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Title</label>
              <Input
                placeholder="What's your discussion about?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border-border bg-secondary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-muted-foreground">Body</label>
              <Textarea
                placeholder="Share your ideas, feedback, or questions..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="min-h-[120px] border-border bg-secondary"
              />
            </div>
            <Button className="w-full" disabled={creating || !newTitle.trim() || !newBody.trim()} onClick={handleCreateThread}>
              {creating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : "Post Discussion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
