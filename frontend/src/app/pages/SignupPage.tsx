import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User, Github } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface SignupPageProps {
  onSignup: () => void;
  onNavigateLogin: () => void;
}

export default function SignupPage({ onSignup, onNavigateLogin }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { signup } = await import('../../api/authApi');
      const data = await signup({ name, email, password });
      console.log('회원가입 성공:', data);
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      onNavigateLogin();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || '이미 사용 중인 이메일이거나 회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-2xl tracking-tighter">S</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">계정 생성하기</h1>
            <p className="text-slate-400 font-medium">SyncAPI와 함께 협업을 시작해보세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-semibold ml-1">이름</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  className="pl-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:border-purple-500 h-12 rounded-xl transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-semibold ml-1">이메일</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 h-12 rounded-xl transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 font-semibold ml-1">비밀번호</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:border-purple-500 h-12 rounded-xl transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  처리 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  가입하기 <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-white/10 after:h-px after:flex-1 after:bg-white/10">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">또는</span>
          </div>

          <div className="mt-8">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-all font-semibold flex items-center gap-3"
            >
              <Github size={20} />
              GitHub으로 가입하기
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              이미 계정이 있으신가요?{' '}
              <button 
                onClick={onNavigateLogin} 
                className="text-purple-400 font-bold hover:text-purple-300 transition-colors"
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
