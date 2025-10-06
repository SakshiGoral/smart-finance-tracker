import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, Sparkles, User, Calendar, Mail, Github, Linkedin, Code, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: Date;
}

const COMMANDS = {
  help: 'help',
  about: 'about',
  skills: 'skills',
  experience: 'experience',
  education: 'education',
  projects: 'projects',
  contact: 'contact',
  clear: 'clear',
  theme: 'theme',
};

const COMMAND_DESCRIPTIONS = [
  { cmd: 'help', desc: 'Display available commands' },
  { cmd: 'about', desc: 'Learn more about me' },
  { cmd: 'skills', desc: 'View my technical skills' },
  { cmd: 'experience', desc: 'See my work experience' },
  { cmd: 'education', desc: 'View my educational background' },
  { cmd: 'projects', desc: 'Explore my projects' },
  { cmd: 'contact', desc: 'Get my contact information' },
  { cmd: 'clear', desc: 'Clear the terminal' },
  { cmd: 'theme', desc: 'Toggle dark/light theme' },
];

export default function InteractiveCLI() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: CommandOutput = {
      id: 'welcome',
      command: '',
      output: (
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-primary"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xl font-bold">Welcome to Interactive CLI Portfolio</span>
          </motion.div>
          <p className="text-muted-foreground">Type 'help' to see available commands</p>
        </div>
      ),
      timestamp: new Date(),
    };
    setHistory([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode;

    switch (trimmedCmd) {
      case COMMANDS.help:
        output = (
          <div className="space-y-2">
            <p className="text-primary font-semibold">Available Commands:</p>
            <div className="grid gap-1">
              {COMMAND_DESCRIPTIONS.map((item) => (
                <div key={item.cmd} className="flex gap-3">
                  <span className="text-secondary font-mono min-w-[120px]">{item.cmd}</span>
                  <span className="text-muted-foreground">- {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case COMMANDS.about:
        output = (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">About Me</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              I'm a passionate Full Stack Developer with expertise in building modern web applications.
              I love creating intuitive user interfaces and robust backend systems. My focus is on
              writing clean, maintainable code and delivering exceptional user experiences.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">Python</Badge>
            </div>
          </div>
        );
        break;

      case COMMANDS.skills:
        output = (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Technical Skills</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-secondary mb-2">Frontend:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>React</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Next.js</Badge>
                  <Badge>Tailwind CSS</Badge>
                  <Badge>Vue.js</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary mb-2">Backend:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Node.js</Badge>
                  <Badge>Express</Badge>
                  <Badge>Python</Badge>
                  <Badge>Django</Badge>
                  <Badge>PostgreSQL</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-secondary mb-2">Tools & Others:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Git</Badge>
                  <Badge>Docker</Badge>
                  <Badge>AWS</Badge>
                  <Badge>CI/CD</Badge>
                  <Badge>REST APIs</Badge>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case COMMANDS.experience:
        output = (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Work Experience</h3>
            </div>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Senior Full Stack Developer</h4>
                  <Badge variant="outline">2022 - Present</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Tech Solutions Inc.</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Led development of enterprise SaaS platform</li>
                  <li>Improved application performance by 40%</li>
                  <li>Mentored junior developers</li>
                </ul>
              </Card>
              <Card className="p-4 border-l-4 border-l-secondary">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Full Stack Developer</h4>
                  <Badge variant="outline">2020 - 2022</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Digital Innovations Ltd.</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Built responsive web applications</li>
                  <li>Implemented RESTful APIs</li>
                  <li>Collaborated with cross-functional teams</li>
                </ul>
              </Card>
            </div>
          </div>
        );
        break;

      case COMMANDS.education:
        output = (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Education</h3>
            </div>
            <Card className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">Bachelor of Science in Computer Science</h4>
                <Badge variant="outline">2016 - 2020</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">University of Technology</p>
              <div className="flex items-center gap-2 mt-3">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-sm">GPA: 3.8/4.0 - Magna Cum Laude</span>
              </div>
            </Card>
          </div>
        );
        break;

      case COMMANDS.projects:
        output = (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Featured Projects</h3>
            </div>
            <div className="space-y-3">
              <Card className="p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">Financial Tracker SaaS</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  A comprehensive finance management platform with AI-powered insights
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">React</Badge>
                  <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                  <Badge variant="secondary" className="text-xs">Node.js</Badge>
                </div>
              </Card>
              <Card className="p-4 hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">E-Commerce Platform</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Full-featured online store with payment integration and admin dashboard
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Next.js</Badge>
                  <Badge variant="secondary" className="text-xs">PostgreSQL</Badge>
                  <Badge variant="secondary" className="text-xs">Stripe</Badge>
                </div>
              </Card>
            </div>
          </div>
        );
        break;

      case COMMANDS.contact:
        output = (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:contact@example.com" className="text-secondary hover:underline">
                  contact@example.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-muted-foreground" />
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                  github.com/username
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="w-4 h-4 text-muted-foreground" />
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                  linkedin.com/in/username
                </a>
              </div>
            </div>
          </div>
        );
        break;

      case COMMANDS.clear:
        setHistory([]);
        return;

      case COMMANDS.theme:
        output = (
          <p className="text-muted-foreground">
            Theme toggle is controlled by the theme switcher in the navigation bar.
          </p>
        );
        break;

      default:
        output = (
          <p className="text-red-500">
            Command not found: '{trimmedCmd}'. Type 'help' for available commands.
          </p>
        );
    }

    const newEntry: CommandOutput = {
      id: Date.now().toString(),
      command: cmd,
      output,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, newEntry]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="overflow-hidden border-2 shadow-2xl">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Interactive CLI Portfolio</h1>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </div>

          <div
            ref={terminalRef}
            className="bg-card p-6 h-[600px] overflow-y-auto font-mono text-sm"
            onClick={() => inputRef.current?.focus()}
          >
            <AnimatePresence>
              {history.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4"
                >
                  {entry.command && (
                    <div className="flex items-center gap-2 mb-2">
                      <ChevronRight className="w-4 h-4 text-primary" />
                      <span className="text-secondary font-semibold">{entry.command}</span>
                    </div>
                  )}
                  <div className="ml-6">{entry.output}</div>
                </motion.div>
              ))}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground"
                placeholder="Type a command..."
                autoFocus
              />
            </form>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <p>Press ↑/↓ to navigate command history • Type 'help' for available commands</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
