import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import Aurora from "~/components/Aurora";
import { Typewriter } from 'react-simple-typewriter'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Grader" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return (
    <>
      <main className="relative min-h-screen bg-[#0a0612]">
        <Aurora />
        <div className="relative z-20">
          <Navbar />
        </div>
        <section className="main-section relative z-10">
          <div className="page-heading py-16">
            <h1 className="relative z-30 !text-white text-center text-3xl md:text-4xl font-bold">
              <Typewriter
                words={['Track Your Applications & Resume Ratings']}
                loop={1}
                cursor
                cursorStyle={false}
                typeSpeed={35}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </h1>
            {!loadingResumes && resumes?.length === 0 ? (
                <h2 className="relative z-30 !text-white"> No resumes found. Upload your first resume to get feedback.</h2>
            ): (
              <h2>Review your submissions and check AI-powered feedback.</h2>
            )}
          </div>
          {loadingResumes && (
              <div className="flex flex-col items-center justify-center">
                <img src="/images/resume-scan-2.gif" className="w-[200px]" />
              </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-10 gap-4">
                <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                  Upload Resume
                </Link>
              </div>
          )}
        </section>
      </main>
      {/* Footer: Add this just after </main> */}
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-6 z-50 flex flex-col items-end gap-2 text-white text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            Built by Sai Ravi Charan
          </span>
          <a
            href="https://www.linkedin.com/in/sai-ravi-charan-neerumalla-b04740278/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hover:scale-110 transition-transform"
            title="Connect on LinkedIn"
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="text-blue-400">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.869 0-2.156 1.459-2.156 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
            </svg>
          </a>
          <a
            href="https://github.com/your-github-username/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hover:scale-110 transition-transform"
            title="Star on GitHub"
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="text-gray-300">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
        </div>
        <div className="text-xs text-gray-300">
          If you like this project, please <a href="https://github.com/your-github-username/your-repo" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300">give a star on GitHub</a>!
        </div>
      </div>
    </>
  )
}
